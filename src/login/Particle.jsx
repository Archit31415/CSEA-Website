import React, { useEffect, useRef } from "react";

export default function Particle() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = 0;
    let height = 0;
    let tracks = [];
    let packets = [];

    // Glowing neon color palette matching CSEA
    const colors = [
      { r: 92, g: 169, b: 251 },  // Neon Blue (#5ca9fb)
      { r: 168, g: 85, b: 247 },  // Neon Violet (#a855f7)
      { r: 6, g: 182, b: 212 },   // Neon Cyan (#06b6d4)
      { r: 59, g: 130, b: 246 }   // Electric Blue (#3b82f6)
    ];

    // Track mouse coordinates for interactive stream connecting
    const mouse = { x: null, y: null, active: false };

    // Helper to calculate coordinates (x, y) along a track at distance 'd'
    const getPositionOnTrack = (track, d) => {
      if (track.points.length === 0) return { x: 0, y: 0, angle: 0 };
      if (d <= 0) return { x: track.points[0].x, y: track.points[0].y, angle: 0 };

      let remaining = d;
      for (let i = 0; i < track.segments.length; i++) {
        const seg = track.segments[i];
        if (remaining <= seg.length) {
          const ratio = remaining / seg.length;
          const x = seg.start.x + (seg.end.x - seg.start.x) * ratio;
          const y = seg.start.y + (seg.end.y - seg.start.y) * ratio;
          const angle = Math.atan2(seg.end.y - seg.start.y, seg.end.x - seg.start.x);
          return { x, y, angle };
        }
        remaining -= seg.length;
      }

      const lastPt = track.points[track.points.length - 1];
      return { x: lastPt.x, y: lastPt.y, angle: 0 };
    };

    // Initialize the PCB-like circuit tracks (horizontal with 45-degree bends)
    const initTracks = (w, h) => {
      const tracksCount = Math.max(14, Math.floor(w / 80));
      const list = [];

      for (let i = 0; i < tracksCount; i++) {
        const points = [];
        const yStart = (i + 1) * (h / (tracksCount + 1)) + (Math.random() * 40 - 20);

        points.push({ x: -50, y: yStart });

        const x1 = w * (0.15 + Math.random() * 0.15);
        points.push({ x: x1, y: yStart });

        const dy1 = (Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * 40);
        let yEnd1 = yStart + dy1;
        if (yEnd1 < 40) yEnd1 = 40;
        if (yEnd1 > h - 40) yEnd1 = h - 40;
        const actualDy1 = yEnd1 - yStart;
        const x2 = x1 + Math.abs(actualDy1);
        points.push({ x: x2, y: yEnd1 });

        const x3 = x2 + w * (0.2 + Math.random() * 0.2);
        points.push({ x: x3, y: yEnd1 });

        const dy2 = (Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * 40);
        let yEnd2 = yEnd1 + dy2;
        if (yEnd2 < 40) yEnd2 = 40;
        if (yEnd2 > h - 40) yEnd2 = h - 40;
        const actualDy2 = yEnd2 - yEnd1;
        const x4 = x3 + Math.abs(actualDy2);
        points.push({ x: x4, y: yEnd2 });

        points.push({ x: w + 50, y: yEnd2 });

        const segments = [];
        let totalLength = 0;
        for (let j = 0; j < points.length - 1; j++) {
          const start = points[j];
          const end = points[j + 1];
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          segments.push({ start, end, length });
          totalLength += length;
        }

        list.push({ points, segments, totalLength });
      }

      return list;
    };

    // Initialize active data packets
    const initPackets = (trackList) => {
      const packetsCount = Math.max(40, Math.floor(width / 30));
      const list = [];

      for (let i = 0; i < packetsCount; i++) {
        const trackIndex = Math.floor(Math.random() * trackList.length);
        const track = trackList[trackIndex];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const distance = Math.random() * track.totalLength;
        const speed = 1.2 + Math.random() * 1.8;
        const size = 2.2 + Math.random() * 2.5;

        list.push({
          trackIndex,
          distance,
          speed,
          size,
          color,
          history: []
        });
      }

      return list;
    };

    // Handle resizing & DPI scaling
    const handleResize = () => {
      const parent = canvas.parentElement;
      const grandParent = parent ? parent.parentElement : null;
      width = parent && parent.clientWidth > 0 ? parent.clientWidth : (grandParent ? grandParent.clientWidth : window.innerWidth);
      height = parent && parent.clientHeight > 0 ? parent.clientHeight : (grandParent ? grandParent.clientHeight : window.innerHeight);

      if (height <= 0) height = 650;

      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      tracks = initTracks(width, height);
      packets = initPackets(tracks);
    };

    // Global window mouse movement listener
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
      } else {
        mouse.active = false;
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    handleResize();

    // Core animation frame
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Circuit trace grid
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, "rgba(92, 169, 251, 0.08)");
      grad.addColorStop(0.5, "rgba(168, 85, 247, 0.15)");
      grad.addColorStop(1, "rgba(6, 182, 212, 0.08)");

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      
      tracks.forEach((track) => {
        ctx.beginPath();
        track.points.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();

        track.points.forEach((pt) => {
          if (pt.x < 0 || pt.x > width) return;

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2.0, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(92, 169, 251, 0.5)";
          ctx.fill();

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(92, 169, 251, 0.2)";
          ctx.stroke();
        });
      });

      // 2. Interactive mouse connection threads
      if (mouse.active && mouse.x !== null && mouse.y !== null) {
        packets.forEach((packet) => {
          if (packet.history.length === 0) return;
          const head = packet.history[packet.history.length - 1];
          const dx = mouse.x - head.x;
          const dy = mouse.y - head.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 200;

          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.5;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(head.x, head.y);
            
            ctx.shadowBlur = 6;
            ctx.shadowColor = `rgb(${packet.color.r}, ${packet.color.g}, ${packet.color.b})`;
            ctx.strokeStyle = `rgba(${packet.color.r}, ${packet.color.g}, ${packet.color.b}, ${opacity})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        });
      }

      // 3. Update and render glowing data packets
      packets.forEach((packet) => {
        const track = tracks[packet.trackIndex];
        if (!track) return;

        let currentSpeed = packet.speed;
        const tempPos = getPositionOnTrack(track, packet.distance);
        if (mouse.active && mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - tempPos.x;
          const dy = mouse.y - tempPos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            currentSpeed *= 1.8;
          }
        }

        packet.distance += currentSpeed;

        if (packet.distance > track.totalLength) {
          packet.trackIndex = Math.floor(Math.random() * tracks.length);
          packet.distance = -20;
          packet.speed = 1.2 + Math.random() * 1.8;
          packet.color = colors[Math.floor(Math.random() * colors.length)];
          packet.history = [];
        }

        const currentPos = getPositionOnTrack(track, packet.distance);
        let renderX = currentPos.x;
        let renderY = currentPos.y;

        if (mouse.active && mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - currentPos.x;
          const dy = mouse.y - currentPos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const pullRadius = 160;
          if (dist < pullRadius) {
            const pullForce = (1 - dist / pullRadius) * 0.32;
            renderX += dx * pullForce;
            renderY += dy * pullForce;
          }
        }

        packet.history.push({ x: renderX, y: renderY });
        if (packet.history.length > 12) {
          packet.history.shift();
        }

        for (let j = 1; j < packet.history.length; j++) {
          const pt1 = packet.history[j - 1];
          const pt2 = packet.history[j];
          const opacity = (j / packet.history.length) * 0.6;
          ctx.beginPath();
          ctx.moveTo(pt1.x, pt1.y);
          ctx.lineTo(pt2.x, pt2.y);
          ctx.strokeStyle = `rgba(${packet.color.r}, ${packet.color.g}, ${packet.color.b}, ${opacity})`;
          ctx.lineWidth = packet.size * (j / packet.history.length) * 1.5;
          ctx.stroke();
        }

        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgb(${packet.color.r}, ${packet.color.g}, ${packet.color.b})`;
        ctx.beginPath();
        ctx.arc(renderX, renderY, packet.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${packet.color.r}, ${packet.color.g}, ${packet.color.b}, 1)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: 1
    }}>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none"
        }}
      />
    </div>
  );
}