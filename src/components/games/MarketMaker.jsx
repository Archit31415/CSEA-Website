import React, { useState, useEffect, useRef } from "react";

const ROUND_TIME = 90; // 90 seconds per round
const STARTING_CASH = 1000;
const MAX_POSITION = 15; // Max contracts you can hold (+15 long or -15 short)

// Helper for combinations (n choose k)
const binom = (n, k) => {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k > n / 2) k = n - k;
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = (res * (n - i + 1)) / i;
  }
  return Math.round(res);
};

// Generates 5 dynamic quantitative questions, progressively getting harder (Round 1 to Round 5)
const generateDynamicQuestions = () => {
  const list = [];
  
  // --- ROUND 1 (EASY) ---
  const r1Templates = [
    () => {
      const n = [3, 4, 5, 6][Math.floor(Math.random() * 4)];
      return {
        question: `You roll ${n} standard 6-sided dice. What is the expected sum of the numbers rolled, multiplied by 10?`,
        answer: n * 35,
        hint1: "The expected value of rolling a single standard 6-sided die is 3.5.",
        hint2: `For ${n} dice, expected sum is ${n} * 3.5. Multiply this by 10.`
      };
    },
    () => {
      const limit = [100, 120, 150, 200][Math.floor(Math.random() * 4)];
      const answer = Math.floor((limit - 1) / 3) + Math.floor((limit - 1) / 5) - Math.floor((limit - 1) / 15);
      return {
        question: `How many positive integers strictly less than ${limit} are divisible by either 3 or 5?`,
        answer: answer,
        hint1: "Use the principle of inclusion-exclusion: add the counts for 3 and 5, then subtract the multiples of 15.",
        hint2: `Divisible by 3 = floor(${(limit-1)}/3). Divisible by 5 = floor(${(limit-1)}/5). Divisible by 15 = floor(${(limit-1)}/15).`
      };
    },
    () => {
      const flips = [60, 80, 100, 120][Math.floor(Math.random() * 4)];
      const pct = [40, 50, 60][Math.floor(Math.random() * 3)];
      return {
        question: `You flip a biased coin ${flips} times. The probability of landing heads is ${pct}%. What is the expected number of heads?`,
        answer: flips * (pct / 100),
        hint1: "The expectation of a binomial distribution is given by N * p.",
        hint2: `Multiply the total flips (${flips}) by the heads probability (${pct / 100}).`
      };
    }
  ];

  // --- ROUND 2 (MEDIUM-EASY) ---
  const r2Templates = [
    () => {
      const m = [18, 36, 72][Math.floor(Math.random() * 3)];
      const answer = Math.round((70 / 36) * m);
      return {
        question: `You roll two standard 6-sided dice. What is the expected absolute difference between the two numbers rolled, multiplied by ${m}, rounded to the nearest integer?`,
        answer: answer,
        hint1: "The expected absolute difference of two standard 6-sided dice is 35/18 (approx 1.944).",
        hint2: `Calculate (35/18) * ${m} and round to the nearest whole number.`
      };
    },
    () => {
      const draws = [8, 12, 16, 20][Math.floor(Math.random() * 4)];
      return {
        question: `You draw ${draws} cards from a standard 52-card deck with replacement. What is the expected number of red cards (hearts or diamonds) drawn, multiplied by 10?`,
        answer: draws * 5,
        hint1: "The probability of drawing a red card in a standard deck is 1/2.",
        hint2: `Since draws are with replacement, expected value is draws * 0.5. Multiply this by 10.`
      };
    },
    () => {
      const n = [6, 8, 10, 12][Math.floor(Math.random() * 4)];
      return {
        question: `A biased coin has a 1 in ${n} chance of landing heads. What is the expected number of flips required to get your first heads, multiplied by 10?`,
        answer: n * 10,
        hint1: "The expected trials to get a success in a geometric distribution is 1/p.",
        hint2: `The expectation is exactly ${n} flips. Multiply this by 10.`
      };
    }
  ];

  // --- ROUND 3 (MEDIUM) ---
  const r3Templates = [
    () => {
      const r = [4, 5, 6, 7][Math.floor(Math.random() * 4)];
      const g = [2, 3][Math.floor(Math.random() * 2)];
      const answer = Math.round(100 * (r + g + 1) / (g + 1));
      return {
        question: `A bag contains ${r} red balls and ${g} green balls. You draw balls one by one without replacement. What is the expected number of draws to get your first green ball, multiplied by 100, rounded to the nearest integer?`,
        answer: answer,
        hint1: "The expected index of the first success when drawing without replacement is (Total + 1) / (Successes + 1).",
        hint2: `Total balls is ${r + g}. Expected draws is (${r + g + 1}) / (${g + 1}). Multiply by 100.`
      };
    },
    () => {
      const n = [4, 5, 6][Math.floor(Math.random() * 3)];
      let harmSum = 0;
      for (let i = 1; i <= n; i++) harmSum += 1 / i;
      const answer = Math.round(n * harmSum * 10);
      return {
        question: `A card game contains ${n} unique character cards. Each pack contains 1 random card. What is the expected number of packs you must open to collect all ${n} cards, multiplied by 10, rounded to the nearest integer?`,
        answer: answer,
        hint1: "This is the coupon collector's problem. Expected trials = N * (1/1 + 1/2 + ... + 1/N).",
        hint2: `For N = ${n}, compute ${n} * (sum of 1/i from 1 to ${n}) * 10.`
      };
    },
    () => {
      const m = [10, 20][Math.floor(Math.random() * 2)];
      return {
        question: `You roll two standard 6-sided dice. What is the expected product of the two numbers rolled, multiplied by ${m}, rounded to the nearest integer?`,
        answer: Math.round(12.25 * m),
        hint1: "For independent variables, E[X * Y] = E[X] * E[Y].",
        hint2: "The expected value of each standard die is 3.5, so the product expectation is 12.25. Multiply by " + m + "."
      };
    }
  ];

  // --- ROUND 4 (MEDIUM-HARD) ---
  const r4Templates = [
    () => {
      const w = [3, 4][Math.floor(Math.random() * 2)];
      const h = [4, 5][Math.floor(Math.random() * 2)];
      const answer = binom(w + h, w);
      return {
        question: `In a grid of size ${w + 1} columns and ${h + 1} rows, how many unique paths are there from the top-left corner to the bottom-right corner, moving only right or down?`,
        answer: answer,
        hint1: "This is a combinations problem. You must choose W right moves out of W + H total moves.",
        hint2: `The number of paths is C(${w + h}, ${w}) = (${w + h})! / (${w}! * ${h}!).`
      };
    },
    () => {
      const n = [3, 4, 5][Math.floor(Math.random() * 3)];
      const answer = Math.round(100 * binom(2 * n, n) / Math.pow(2, 2 * n));
      return {
        question: `You flip a fair coin ${2 * n} times. What is the percentage probability (0 to 100) that you get exactly ${n} heads and ${n} tails, rounded to the nearest integer?`,
        answer: answer,
        hint1: "Use the binomial probability formula: P(exactly N heads) = C(2N, N) * (0.5)^(2N).",
        hint2: `Evaluate: 100 * C(${2 * n}, ${n}) / ${Math.pow(2, 2 * n)} and round.`
      };
    },
    () => {
      const s = [6, 8][Math.floor(Math.random() * 2)];
      const n = [4, 5, 6][Math.floor(Math.random() * 3)];
      const answer = Math.round(100 * (1 - Math.pow((s - 1) / s, n)));
      return {
        question: `You roll a standard ${s}-sided die ${n} times. What is the percentage probability (0 to 100) of rolling at least one '1', rounded to the nearest integer?`,
        answer: answer,
        hint1: "Calculate the complement: the probability of never rolling a '1' in all rolls.",
        hint2: `Complement probability is (${s - 1}/${s})^${n}. Subtract this from 1 and multiply by 100.`
      };
    }
  ];

  // --- ROUND 5 (HARD) ---
  const r5Templates = [
    () => {
      const n = [2, 3, 4][Math.floor(Math.random() * 3)];
      // expected max of n dice
      let expectedMax = 0;
      for (let k = 1; k <= 6; k++) {
        const p = Math.pow(k / 6, n) - Math.pow((k - 1) / 6, n);
        expectedMax += k * p;
      }
      const answer = Math.round(expectedMax * 60);
      return {
        question: `You roll ${n} standard 6-sided dice. What is the expected value of the MAXIMUM number rolled among the dice, multiplied by 60, rounded to the nearest integer?`,
        answer: answer,
        hint1: "Find P(Max = k) by computing P(all <= k) - P(all <= k-1) = (k/6)^N - ((k-1)/6)^N.",
        hint2: `Expected Max = sum of k * P(Max = k) for k = 1 to 6. For ${n} dice, it's roughly ${expectedMax.toFixed(3)}. Multiply by 60.`
      };
    },
    () => {
      const w = [4, 5][Math.floor(Math.random() * 2)];
      const b = [4, 5][Math.floor(Math.random() * 2)];
      const total = w + b;
      const pBothWhite = (w / total) * ((w - 1) / (total - 1));
      const pBothBlack = (b / total) * ((b - 1) / (total - 1));
      const answer = Math.round(100 * (pBothWhite + pBothBlack));
      return {
        question: `An urn contains ${w} white balls and ${b} black balls. You draw two balls at random without replacement. What is the percentage probability (0 to 100) that both balls are of the same color, rounded to the nearest integer?`,
        answer: answer,
        hint1: "Sum the probability of drawing two white balls and the probability of drawing two black balls.",
        hint2: `P(White-White) = (${w}/${total})*(${w-1}/${total-1}). P(Black-Black) = (${b}/${total})*(${b-1}/${total-1}).`
      };
    },
    () => {
      const doors = [4, 5][Math.floor(Math.random() * 2)];
      const pWin = ((doors - 1) / doors) * (1 / (doors - 2));
      const answer = Math.round(100 * pWin);
      return {
        question: `You play a variant of the Monty Hall problem with ${doors} doors and 1 car. You pick a door. Host opens 1 door showing a goat. You switch to one of the remaining doors at random. What is your percentage probability (0 to 100) of winning the car, rounded to the nearest integer?`,
        answer: answer,
        hint1: "If your initial pick is incorrect, Host opens a goat door, and switching chooses randomly among the remaining non-host doors.",
        hint2: `Probability is P(initially wrong) * (1 / (doors - 2)) = (${doors-1}/${doors}) * (1/${doors-2}).`
      };
    }
  ];

  // Pick one template for each round
  const q1 = r1Templates[Math.floor(Math.random() * r1Templates.length)]();
  const q2 = r2Templates[Math.floor(Math.random() * r2Templates.length)]();
  const q3 = r3Templates[Math.floor(Math.random() * r3Templates.length)]();
  const q4 = r4Templates[Math.floor(Math.random() * r4Templates.length)]();
  const q5 = r5Templates[Math.floor(Math.random() * r5Templates.length)]();

  list.push({ id: 1, ...q1 });
  list.push({ id: 2, ...q2 });
  list.push({ id: 3, ...q3 });
  list.push({ id: 4, ...q4 });
  list.push({ id: 5, ...q5 });

  return list;
};

const GAME_STATE = {
  START: "START",
  PLAYING: "PLAYING",
  ROUND_END: "ROUND_END",
  GAMEOVER: "GAMEOVER"
};

export const MarketMaker = () => {
  const [gameState, setGameState] = useState(GAME_STATE.START);
  const [round, setRound] = useState(1);
  const [cash, setCash] = useState(STARTING_CASH);
  const [inventory, setInventory] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(ROUND_TIME);
  const [botCenter, setBotCenter] = useState(100);
  const [currentSpread, setCurrentSpread] = useState(20);
  const [limitBidPrice, setLimitBidPrice] = useState("");
  const [limitAskPrice, setLimitAskPrice] = useState("");
  const [activeLimitBid, setActiveLimitBid] = useState(null); // { price, size }
  const [activeLimitAsk, setActiveLimitAsk] = useState(null); // { price, size }
  const [trades, setTrades] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [roundHistory, setRoundHistory] = useState([]);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("csea_market_maker_high_score") || "0", 10);
  });

  const gameTimerRef = useRef(null);
  const simTimerRef = useRef(null);

  // Generate unique ID for items
  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Toast Helper
  const addToast = (message, type = "info") => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== GAME_STATE.PLAYING) return;
      const key = e.key.toLowerCase();
      if (key === "b" && e.target.tagName !== "INPUT") {
        e.preventDefault();
        handleMarketBuy();
      } else if (key === "s" && e.target.tagName !== "INPUT") {
        e.preventDefault();
        handleMarketSell();
      } else if (key === "c" && e.target.tagName !== "INPUT") {
        e.preventDefault();
        cancelLimitOrders();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, botCenter, currentSpread, cash, inventory]);

  // Cleanup timers on component unmount
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, []);

  // Monitor countdown timer to settle the round when it hits 0
  useEffect(() => {
    if (gameState === GAME_STATE.PLAYING && timeRemaining === 0) {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (simTimerRef.current) clearInterval(simTimerRef.current);
      
      const currentQ = questions[round - 1];
      if (currentQ) {
        settleRound(currentQ.answer, currentQ);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, gameState, round, questions]);

  const startNewGame = () => {
    const selected = generateDynamicQuestions();
    setQuestions(selected);
    setRound(1);
    setCash(STARTING_CASH);
    setInventory(0);
    setRoundHistory([]);
    startRound(1, selected, STARTING_CASH);
  };

  const startRound = (roundNum, selectedQuestions, currentCash) => {
    const activeQuestions = selectedQuestions || questions;
    const currentQ = activeQuestions[roundNum - 1];
    const trueAns = currentQ.answer;

    // Initialize botCenter away from true answer with noise
    // Variance is scaled by the size of the answer
    const direction = Math.random() > 0.5 ? 1 : -1;
    const devPct = 0.2 + Math.random() * 0.25; // 20% to 45% deviation
    const offset = Math.round(trueAns * devPct * direction);
    const startCenter = Math.max(15, trueAns + offset);

    setBotCenter(startCenter);
    // Initial spread starts wide, roughly 20-30% of valuation
    const startSpread = Math.max(8, Math.round(startCenter * (0.2 + Math.random() * 0.1)));
    setCurrentSpread(startSpread);

    setTimeRemaining(ROUND_TIME);
    setInventory(0);
    setLimitBidPrice("");
    setLimitAskPrice("");
    setActiveLimitBid(null);
    setActiveLimitAsk(null);
    setToasts([]);
    
    // Clear old trades, place an initial print
    setTrades([
      {
        id: generateId(),
        time: ROUND_TIME,
        price: startCenter,
        type: "bot"
      }
    ]);

    setGameState(GAME_STATE.PLAYING);

    // Round countdown timer
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    gameTimerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(gameTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Bot/Order book simulation timer
    if (simTimerRef.current) clearInterval(simTimerRef.current);
    simTimerRef.current = setInterval(() => {
      tickSimulation(trueAns);
    }, 500);
  };

  const settleRound = (trueAns, currentQ) => {
    setGameState(GAME_STATE.ROUND_END);
    
    const valueSettled = inventory * trueAns;
    const finalCash = cash + valueSettled;
    const prevSettledCash = roundHistory.length > 0 
      ? roundHistory[roundHistory.length - 1].settledCash 
      : STARTING_CASH;
    const profit = finalCash - prevSettledCash;
    
    setRoundHistory((prevHist) => [
      ...prevHist,
      {
        round: round,
        question: currentQ.question,
        trueAnswer: trueAns,
        finalInventory: inventory,
        startingCash: prevSettledCash,
        settledCash: finalCash,
        profit: profit
      }
    ]);
    
    setCash(finalCash);
    setInventory(0);
  };

  const nextRound = () => {
    if (round < 5) {
      const nextR = round + 1;
      setRound(nextR);
      startRound(nextR, questions, cash);
    } else {
      setGameState(GAME_STATE.GAMEOVER);
      const endCash = cash;
      const netProfit = endCash - STARTING_CASH;
      if (netProfit > highScore) {
        setHighScore(netProfit);
        localStorage.setItem("csea_market_maker_high_score", netProfit.toString());
      }
    }
  };

  // Bot updates and execution check
  const tickSimulation = (trueAns) => {
    setTimeRemaining((currentTime) => {
      setBotCenter((prevCenter) => {
        // Convergence rate determines how fast bot estimates move to true answer.
        // It accelerates as time ticks down and hints are revealed.
        let convRate = 0.05; // 5% per tick default
        let noiseScale = 0.04;

        if (currentTime <= 30) {
          convRate = 0.18; // fast convergence near end
          noiseScale = 0.01;
        } else if (currentTime <= 60) {
          convRate = 0.10; // medium convergence
          noiseScale = 0.02;
        }

        const dev = trueAns - prevCenter;
        const convergenceStep = dev * convRate;
        const noise = (Math.random() - 0.5) * trueAns * noiseScale;
        const nextCenter = Math.max(5, Math.round(prevCenter + convergenceStep + noise));

        // Spread decays over time from wide to narrow
        setCurrentSpread((prevSpread) => {
          const minSpread = Math.max(2, Math.round(trueAns * 0.015)); // converges down to 1.5% spread
          const progress = currentTime / ROUND_TIME; // 1.0 down to 0
          const startSpread = Math.round(trueAns * 0.25);
          return Math.max(minSpread, Math.round(startSpread * progress + minSpread));
        });

        // Check player's limit order fills using the actual book spread
        const progress = currentTime / ROUND_TIME; // 1.0 down to 0
        const startSpread = Math.round(trueAns * 0.25);
        const minSpread = Math.max(2, Math.round(trueAns * 0.015));
        const fillSpread = Math.max(minSpread, Math.round(startSpread * progress + minSpread));
        
        // LIMIT BID FILL CHECK (Player wants to Buy at price X)
        setActiveLimitBid((activeBid) => {
          if (activeBid) {
            // Bots sell if player's Bid is high relative to bot's valuation
            // We draw a bot private valuation: nextCenter + noise
            const botVal = nextCenter + (Math.random() - 0.5) * fillSpread;
            if (activeBid.price >= botVal) {
              setInventory((prevInv) => {
                if (prevInv >= MAX_POSITION) {
                  addToast("Limit Buy failed: Position limit reached", "warning");
                  return prevInv;
                }
                setCash((prevCash) => prevCash - activeBid.price);
                setTrades((t) => [
                  ...t,
                  {
                    id: generateId(),
                    time: currentTime,
                    price: activeBid.price,
                    type: "buy"
                  }
                ]);
                addToast(`Limit Order Filled: Bought 1 @ $${activeBid.price}`, "success");
                return prevInv + 1;
              });
              return null; // Bid is filled, remove order
            }
          }
          return activeBid;
        });

        // LIMIT ASK FILL CHECK (Player wants to Sell at price Y)
        setActiveLimitAsk((activeAsk) => {
          if (activeAsk) {
            // Bots buy if player's Ask is low relative to bot's valuation
            const botVal = nextCenter + (Math.random() - 0.5) * fillSpread;
            if (activeAsk.price <= botVal) {
              setInventory((prevInv) => {
                if (prevInv <= -MAX_POSITION) {
                  addToast("Limit Sell failed: Position limit reached", "warning");
                  return prevInv;
                }
                setCash((prevCash) => prevCash + activeAsk.price);
                setTrades((t) => [
                  ...t,
                  {
                    id: generateId(),
                    time: currentTime,
                    price: activeAsk.price,
                    type: "sell"
                  }
                ]);
                addToast(`Limit Order Filled: Sold 1 @ $${activeAsk.price}`, "success");
                return prevInv - 1;
              });
              return null; // Ask is filled, remove order
            }
          }
          return activeAsk;
        });

        // Simulate independent bot-to-bot trades (fills order book activity)
        if (Math.random() < 0.35) {
          const tradePrice = Math.round(nextCenter + (Math.random() - 0.5) * fillSpread * 0.6);
          setTrades((prev) => [
            ...prev,
            {
              id: generateId(),
              time: currentTime,
              price: tradePrice,
              type: "bot"
            }
          ]);
        }

        return nextCenter;
      });
      return currentTime;
    });
  };

  // Market Orders
  const handleMarketBuy = () => {
    if (inventory >= MAX_POSITION) {
      addToast("Cannot buy: Position limit of +15 contracts reached!", "warning");
      return;
    }
    const askPrice = getMarketAsk();
    setCash((prev) => prev - askPrice);
    setInventory((prev) => prev + 1);
    setTrades((prev) => [
      ...prev,
      {
        id: generateId(),
        time: timeRemaining,
        price: askPrice,
        type: "buy"
      }
    ]);
    addToast(`Market Buy: 1 contract @ $${askPrice}`, "success");
  };

  const handleMarketSell = () => {
    if (inventory <= -MAX_POSITION) {
      addToast("Cannot sell: Position limit of -15 contracts reached!", "warning");
      return;
    }
    const bidPrice = getMarketBid();
    setCash((prev) => prev + bidPrice);
    setInventory((prev) => prev - 1);
    setTrades((prev) => [
      ...prev,
      {
        id: generateId(),
        time: timeRemaining,
        price: bidPrice,
        type: "sell"
      }
    ]);
    addToast(`Market Sell: 1 contract @ $${bidPrice}`, "success");
  };

  // Limit Order posting
  const postLimitBid = (e) => {
    e.preventDefault();
    const price = parseInt(limitBidPrice, 10);
    if (isNaN(price) || price <= 0) {
      addToast("Invalid Bid Price", "error");
      return;
    }
    const marketAsk = getMarketAsk();
    if (price >= marketAsk) {
      addToast(`Bid price crossed Ask. Filled immediately @ Market Ask ($${marketAsk})`, "info");
      handleMarketBuy();
      setLimitBidPrice("");
      return;
    }
    setActiveLimitBid({ price, size: 5 });
    setLimitBidPrice("");
    addToast(`Posted Limit Bid @ $${price}`, "info");
  };

  const postLimitAsk = (e) => {
    e.preventDefault();
    const price = parseInt(limitAskPrice, 10);
    if (isNaN(price) || price <= 0) {
      addToast("Invalid Ask Price", "error");
      return;
    }
    const marketBid = getMarketBid();
    if (price <= marketBid) {
      addToast(`Ask price crossed Bid. Filled immediately @ Market Bid ($${marketBid})`, "info");
      handleMarketSell();
      setLimitAskPrice("");
      return;
    }
    setActiveLimitAsk({ price, size: 5 });
    setLimitAskPrice("");
    addToast(`Posted Limit Ask @ $${price}`, "info");
  };

  const cancelLimitOrders = () => {
    setActiveLimitBid(null);
    setActiveLimitAsk(null);
    addToast("Cancelled active limit orders", "info");
  };

  // Get current market prices
  const getMarketBid = () => {
    return Math.max(1, Math.round(botCenter - currentSpread / 2));
  };

  const getMarketAsk = () => {
    return Math.max(2, Math.round(botCenter + currentSpread / 2));
  };

  // Order Book levels builder
  const getBookLevels = () => {
    const bid1 = getMarketBid();
    const ask1 = getMarketAsk();

    // Adjust levels if player's limits are active
    const finalBids = [
      { price: bid1, size: 8 },
      { price: Math.max(1, bid1 - Math.round(currentSpread * 0.15 + 1)), size: 12 },
      { price: Math.max(1, bid1 - Math.round(currentSpread * 0.35 + 2)), size: 15 }
    ];

    if (activeLimitBid) {
      const p = activeLimitBid.price;
      if (p >= finalBids[0].price) {
        finalBids.unshift({ price: p, size: 5, player: true });
        finalBids.pop(); // keep 3 levels
      } else if (p >= finalBids[1].price) {
        finalBids.splice(1, 0, { price: p, size: 5, player: true });
        finalBids.pop();
      } else if (p >= finalBids[2].price) {
        finalBids[2] = { price: p, size: 5, player: true };
      }
    }

    const finalAsks = [
      { price: ask1, size: 6 },
      { price: ask1 + Math.round(currentSpread * 0.15 + 1), size: 9 },
      { price: ask1 + Math.round(currentSpread * 0.35 + 2), size: 14 }
    ];

    if (activeLimitAsk) {
      const p = activeLimitAsk.price;
      if (p <= finalAsks[0].price) {
        finalAsks.unshift({ price: p, size: 5, player: true });
        finalAsks.pop();
      } else if (p <= finalAsks[1].price) {
        finalAsks.splice(1, 0, { price: p, size: 5, player: true });
        finalAsks.pop();
      } else if (p <= finalAsks[2].price) {
        finalAsks[2] = { price: p, size: 5, player: true };
      }
    }

    return { bids: finalBids, asks: finalAsks };
  };

  const book = getBookLevels();
  const currentMid = Math.round((getMarketBid() + getMarketAsk()) / 2);
  const unrealizedPl = inventory * (currentMid - (trades.filter(t => t.type !== "bot" && (t.type === "buy" || t.type === "sell")).reduce((acc, curr) => acc + (curr.type === "buy" ? curr.price : -curr.price), 0) / (Math.abs(inventory) || 1) || currentMid));
  // Total equity = Cash + Position Value
  const totalEquity = cash + (inventory * currentMid);

  // SVG Chart points builder
  const renderSvgChart = () => {
    if (trades.length < 2) return null;
    const width = 500;
    const height = 180;
    const padding = 20;

    const prices = trades.map((t) => t.price);
    const minPrice = Math.min(...prices) * 0.95;
    const maxPrice = Math.max(...prices) * 1.05;
    const priceDiff = maxPrice - minPrice || 1;

    const points = trades.map((t, idx) => {
      // Map time (ROUND_TIME down to 0) to X coordinate (padding to width-padding)
      const x = padding + ((ROUND_TIME - t.time) / ROUND_TIME) * (width - 2 * padding);
      // Map price to Y coordinate (height-padding to padding)
      const y = height - padding - ((t.price - minPrice) / priceDiff) * (height - 2 * padding);
      return { x, y, type: t.type };
    });

    const pathData = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    
    // Gradient fill path data
    const fillPathData = `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    return (
      <svg className="mm-chart-svg" viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
        <defs>
          <linearGradient id="chartGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4facfe" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4facfe" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.1)" />

        {/* Gradient fill */}
        <path d={fillPathData} fill="url(#chartGlow)" />

        {/* Main Line */}
        <path d={pathData} fill="none" stroke="#4facfe" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots for user trades */}
        {points.map((p, idx) => {
          if (p.type === "buy") {
            return <circle key={idx} cx={p.x} cy={p.y} r="5" fill="#00e676" stroke="#fff" strokeWidth="1.5" />;
          }
          if (p.type === "sell") {
            return <circle key={idx} cx={p.x} cy={p.y} r="5" fill="#ff1744" stroke="#fff" strokeWidth="1.5" />;
          }
          return null;
        })}
      </svg>
    );
  };

  const getRankDetails = (netProfit) => {
    if (netProfit < 0) return { title: "Liquidated Intern 📉", color: "#ff1744", desc: "Ouch. The order book was too quick, or estimation was off-market. Don't worry, even Ken Griffin had tough days. Try again!" };
    if (netProfit < 500) return { title: "Junior Trader 💼", color: "#ffb199", desc: "Solid risk control! You ended green, but there's room to quote tighter spreads and capture more volume." };
    if (netProfit < 1500) return { title: "Market Maker Associate 📈", color: "#00f2fe", desc: "Impressive! You managed your inventory well and reacted quickly to hint arrivals. You're ready for the desk." };
    if (netProfit < 3000) return { title: "VP of Quantitative Trading 🚀", color: "#e040fb", desc: "Exceptional! High execution fill rates and outstanding estimation. Optiver recruiters are looking for you." };
    return { title: "Citadel / Jane Street Partner 👑", color: "#00e676", desc: "Absolute master of liquidity! Flawless inventory shading and perfect estimation bounds. You are the market." };
  };

  // Clipboard copy Share stats
  const handleShare = () => {
    const netProfit = cash - STARTING_CASH;
    const rank = getRankDetails(netProfit).title;
    const text = `📊 CSEA Arcade: Quant Market Maker Challenge 📊\nRank: ${rank}\nFinal P&L: $${netProfit.toLocaleString()}\nHigh Score: $${highScore.toLocaleString()}\nCan you make a better spread? Play at CSEA Arcade!`;
    navigator.clipboard.writeText(text).then(() => {
      alert("Results copied to clipboard! Share it with your friends.");
    }).catch(() => {
      alert("Could not copy stats. Please select and copy manually.");
    });
  };

  return (
    <div className="game-play-area mm-play-area">
      {/* Toast notifications */}
      <div className="mm-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`mm-toast ${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>

      {gameState === GAME_STATE.START && (
        <div className="mm-start-screen">
          <span className="game-icon">📊</span>
          <h3>CSEA Market Maker</h3>
          <p>
            Welcome to the trading desk! You will participate in <b>5 rounds</b> of estimation contracts.
            For each round, you trade an asset whose contract settlement price is the <b>true numerical answer</b> to the question.
          </p>

          <div className="mm-rules-box">
            <h4>Trading Rules:</h4>
            <ul>
              <li>Start with <b>$1,000 cash</b>. Settle positions to capture profit.</li>
              <li><b>Market Buy/Sell</b>: Instantly fill at top Ask (red) or top Bid (green).</li>
              <li><b>Make Market</b>: Set a Limit Bid and Limit Ask. Bots will trade with your limits if they cross bot valuations.</li>
              <li><b>Hints</b> arrive at 60s and 30s remaining, making bots converge to the answer.</li>
              <li><b>Adverse Selection</b>: Make sure you don't keep stale limit quotes when new hints leak!</li>
              <li><b>Risk Management</b>: Position limit is <b>±15 contracts max</b>.</li>
            </ul>
          </div>

          <div className="game-stats">
            Desk High Score P&L: ${highScore.toLocaleString()}
          </div>

          <button className="btn-game-primary" onClick={startNewGame}>
            Open Trading Terminal
          </button>
        </div>
      )}

      {gameState === GAME_STATE.PLAYING && questions[round - 1] && (
        <div className="mm-terminal">
          {/* Header Bar */}
          <div className="mm-header-bar">
            <div className="mm-desk-info">
              <span className="mm-live-indicator">● LIVE</span>
              <span>Round {round}/5</span>
            </div>
            <div className="mm-timer-box">
              <span className="mm-timer-label">Time to Settlement:</span>
              <span className={`mm-timer-digits ${timeRemaining <= 10 ? "red-alert" : ""}`}>
                {timeRemaining}s
              </span>
            </div>
          </div>

          {/* Question Box */}
          <div className="mm-question-panel">
            <div className="mm-panel-header">Asset Description (True Value)</div>
            <div className="mm-question-body">
              {questions[round - 1].question}
            </div>
          </div>

          {/* Core Grid */}
          <div className="mm-grid-layout">
            
            {/* Left Column: Order Book & Controls */}
            <div className="mm-book-column">
              
              {/* Order Book */}
              <div className="mm-panel order-book-panel">
                <div className="mm-panel-header">Order Book</div>
                <div className="mm-book-grid">
                  <div className="mm-book-headers">
                    <span>Price</span>
                    <span>Size</span>
                  </div>

                  {/* Asks (Sells) - Sorted Descending */}
                  <div className="mm-book-asks">
                    {book.asks.slice().reverse().map((ask, idx) => (
                      <div key={idx} className={`mm-book-row ask ${ask.player ? "player-quote" : ""}`}>
                        <span className="price-label">${ask.price}</span>
                        <span>{ask.size} {ask.player && <span className="player-tag">(YOU)</span>}</span>
                      </div>
                    ))}
                  </div>

                  {/* Spread / Mid Price Indicator */}
                  <div className="mm-book-mid">
                    <span className="mid-label">Mid Price: ${currentMid}</span>
                    <span className="spread-label">Spread: ${currentSpread}</span>
                  </div>

                  {/* Bids (Buys) - Sorted Descending */}
                  <div className="mm-book-bids">
                    {book.bids.map((bid, idx) => (
                      <div key={idx} className={`mm-book-row bid ${bid.player ? "player-quote" : ""}`}>
                        <span className="price-label">${bid.price}</span>
                        <span>{bid.size} {bid.player && <span className="player-tag">(YOU)</span>}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trading Desk Controls */}
              <div className="mm-panel controls-panel">
                <div className="mm-panel-header">Order Entry</div>
                <div className="mm-controls-body">
                  
                  {/* Market Orders */}
                  <div className="market-row">
                    <button className="btn-market buy" onClick={handleMarketBuy}>
                      Mkt Buy (${getMarketAsk()})
                    </button>
                    <button className="btn-market sell" onClick={handleMarketSell}>
                      Mkt Sell (${getMarketBid()})
                    </button>
                  </div>

                  {/* Limit Quoting */}
                  <div className="limit-quoting">
                    <form onSubmit={postLimitBid} className="limit-form">
                      <input
                        type="number"
                        placeholder="Limit Bid Price"
                        value={limitBidPrice}
                        onChange={(e) => setLimitBidPrice(e.target.value)}
                        className="limit-input bid-border"
                      />
                      <button type="submit" className="btn-limit bid">Post Bid</button>
                    </form>

                    <form onSubmit={postLimitAsk} className="limit-form">
                      <input
                        type="number"
                        placeholder="Limit Ask Price"
                        value={limitAskPrice}
                        onChange={(e) => setLimitAskPrice(e.target.value)}
                        className="limit-input ask-border"
                      />
                      <button type="submit" className="btn-limit ask">Post Ask</button>
                    </form>
                  </div>

                  {/* Active orders cancel */}
                  {(activeLimitBid || activeLimitAsk) && (
                    <button className="btn-cancel" onClick={cancelLimitOrders}>
                      Cancel My Quotes (Esc/C)
                    </button>
                  )}
                  
                  <div className="controls-hint">
                    Hotkeys: <b>[B]</b> Buy Market | <b>[S]</b> Sell Market | <b>[C]</b> Cancel Limit
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Chart & Info */}
            <div className="mm-chart-column">
              
              {/* Real-time price chart */}
              <div className="mm-panel chart-panel">
                <div className="mm-panel-header">Price History</div>
                <div className="mm-chart-wrapper">
                  {renderSvgChart()}
                </div>
              </div>

              {/* Information Feed (Hints & Logs) */}
              <div className="mm-panel info-feed-panel">
                <div className="mm-panel-header">Market Intel & Hints</div>
                <div className="mm-info-body">
                  
                  {/* Time-locked hints */}
                  <div className="hints-section">
                    <div className={`hint-item ${timeRemaining <= 60 ? "unlocked" : "locked"}`}>
                      <span className="hint-indicator">⚡ T-60 Hint:</span>
                      <span className="hint-text">
                        {timeRemaining <= 60 ? questions[round - 1].hint1 : "Revealing in " + Math.max(0, timeRemaining - 60) + "s..."}
                      </span>
                    </div>

                    <div className={`hint-item ${timeRemaining <= 30 ? "unlocked" : "locked"}`}>
                      <span className="hint-indicator">⚡ T-30 Hint:</span>
                      <span className="hint-text">
                        {timeRemaining <= 30 ? questions[round - 1].hint2 : "Revealing in " + Math.max(0, timeRemaining - 30) + "s..."}
                      </span>
                    </div>
                  </div>

                  {/* Position Log */}
                  <div className="trades-feed-section">
                    <div className="feed-header">Recent Executions</div>
                    <div className="feed-list">
                      {trades.filter(t => t.type !== "bot").slice(-4).reverse().map((t) => (
                        <div key={t.id} className={`feed-row ${t.type}`}>
                          <span>T-{t.time}s</span>
                          <span>{t.type === "buy" ? "Bought" : "Sold"} 1 Contract @ ${t.price}</span>
                        </div>
                      ))}
                      {trades.filter(t => t.type !== "bot").length === 0 && (
                        <div className="feed-empty">No fills yet. Post quotes to capture edge.</div>
                      )}
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>

          {/* Bottom Bar: Position Summary */}
          <div className="mm-position-bar">
            <div className="pos-stat">
              <span className="pos-label">Cash:</span>
              <span className="pos-value">${cash.toLocaleString()}</span>
            </div>
            <div className="pos-stat">
              <span className="pos-label">Inventory:</span>
              <span className={`pos-value ${inventory > 0 ? "long-green" : inventory < 0 ? "short-red" : ""}`}>
                {inventory > 0 ? `+${inventory}` : inventory} contracts
              </span>
            </div>
            <div className="pos-stat">
              <span className="pos-label">Equity (Mid):</span>
              <span className="pos-value">${Math.round(totalEquity).toLocaleString()}</span>
            </div>
            <div className="pos-stat">
              <span className="pos-label">Round P&L (Unrealized):</span>
              <span className={`pos-value ${unrealizedPl >= 0 ? "long-green" : "short-red"}`}>
                {unrealizedPl >= 0 ? "+" : ""}${Math.round(unrealizedPl).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {gameState === GAME_STATE.ROUND_END && roundHistory[round - 1] && (
        <div className="mm-settlement-screen">
          <span className="game-icon" style={{ fontSize: "50px" }}>🔔</span>
          <h3>Round {round} Settlement</h3>
          
          <div className="settlement-question-review">
            <b>{questions[round - 1].question}</b>
          </div>

          <div className="settlement-grid">
            <div className="settlement-card highlight">
              <div className="settlement-val">${roundHistory[round - 1].trueAnswer}</div>
              <div className="settlement-label">Settlement Price (True Answer)</div>
            </div>

            <div className="settlement-card">
              <div className="settlement-val">{roundHistory[round - 1].finalInventory}</div>
              <div className="settlement-label">Held Inventory at Expiry</div>
            </div>

            <div className="settlement-card">
              <div className="settlement-val">
                {roundHistory[round - 1].profit >= 0 ? "+" : ""}${Math.round(roundHistory[round - 1].profit).toLocaleString()}
              </div>
              <div className="settlement-label">Round P&L</div>
            </div>
          </div>

          <div className="settlement-details-list">
            <div className="details-row">
              <span>Cash Before Settlement:</span>
              <span>${(roundHistory[round - 1].settledCash - (roundHistory[round - 1].finalInventory * roundHistory[round - 1].trueAnswer)).toLocaleString()}</span>
            </div>
            <div className="details-row">
              <span>Inventory Payout:</span>
              <span>${(roundHistory[round - 1].finalInventory * roundHistory[round - 1].trueAnswer).toLocaleString()}</span>
            </div>
            <div className="details-row total-row">
              <span>Ending Cash:</span>
              <span>${roundHistory[round - 1].settledCash.toLocaleString()}</span>
            </div>
          </div>

          <button className="btn-game-primary" onClick={nextRound}>
            {round < 5 ? `Start Round ${round + 1}` : "View Final Results"}
          </button>
        </div>
      )}

      {gameState === GAME_STATE.GAMEOVER && (
        <div className="mm-gameover-screen">
          <span className="game-icon" style={{ fontSize: "64px" }}>🏆</span>
          <h3>Desk Performance Report</h3>
          
          {(() => {
            const netProfit = cash - STARTING_CASH;
            const rank = getRankDetails(netProfit);
            return (
              <>
                <div className="final-rank-box" style={{ borderColor: rank.color }}>
                  <div className="rank-title" style={{ color: rank.color }}>{rank.title}</div>
                  <p className="rank-desc">{rank.desc}</p>
                </div>

                <div className="results-grid">
                  <div className="results-stat-card">
                    <div className="results-stat-val">
                      {netProfit >= 0 ? "+" : ""}${netProfit.toLocaleString()}
                    </div>
                    <div className="results-stat-label">Net Profit / Loss</div>
                  </div>
                  <div className="results-stat-card">
                    <div className="results-stat-val">${cash.toLocaleString()}</div>
                    <div className="results-stat-label">Final Bankroll</div>
                  </div>
                  <div className="results-stat-card">
                    <div className="results-stat-val">${highScore.toLocaleString()}</div>
                    <div className="results-stat-label">Personal High Score</div>
                  </div>
                </div>
              </>
            );
          })()}

          <div className="review-section">
            <h4>Rounds Breakdown</h4>
            <div className="review-table-container">
              <table className="review-table">
                <thead>
                  <tr>
                    <th>Round</th>
                    <th>True Answer</th>
                    <th>Inventory Settled</th>
                    <th>P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {roundHistory.map((h, idx) => (
                    <tr key={idx} className={h.profit >= 0 ? "correct" : "incorrect"}>
                      <td>#{h.round}</td>
                      <td>{h.trueAnswer}</td>
                      <td>{h.finalInventory}</td>
                      <td>{h.profit >= 0 ? "+" : ""}${Math.round(h.profit).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="results-actions" style={{ marginTop: "30px" }}>
            <button className="btn-game-primary" onClick={startNewGame}>
              Trade Again
            </button>
            <button className="btn-game-secondary" onClick={handleShare}>
              Share Performance
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketMaker;
