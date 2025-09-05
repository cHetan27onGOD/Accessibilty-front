// AccessQuest - Enhanced Gamification JavaScript

// Game state management
let gameState = {
  level: parseInt(localStorage.getItem("accessquest_level")) || 1,
  xp: parseInt(localStorage.getItem("accessquest_xp")) || 0,
  streak: parseInt(localStorage.getItem("accessquest_streak")) || 0,
  totalScore: parseInt(localStorage.getItem("accessquest_total_score")) || 0,
  lastAnalysisDate: localStorage.getItem("accessquest_last_analysis"),
  achievements: JSON.parse(localStorage.getItem("accessquest_achievements")) || [],
  // New gamification elements
  coins: parseInt(localStorage.getItem("accessquest_coins")) || 0,
  badges: JSON.parse(localStorage.getItem("accessquest_badges")) || [],
  questsCompleted: parseInt(localStorage.getItem("accessquest_quests_completed")) || 0,
  powerUps: JSON.parse(localStorage.getItem("accessquest_power_ups")) || []
};

// Initialize game UI
function initializeGame() {
  updateGameStats();
  checkStreak();
  createParticles();
  setupEventListeners();
  displayBadges();
}

// Create particle effects for background
function createParticles() {
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles';
  document.body.appendChild(particlesContainer);
  
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = `${Math.random() * 5 + 2}px`;
    particle.style.height = particle.style.width;
    particle.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    particle.style.borderRadius = '50%';
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.opacity = Math.random() * 0.5 + 0.1;
    
    // Animation
    const duration = Math.random() * 20 + 10;
    particle.style.animation = `float ${duration}s infinite ease-in-out`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    
    particlesContainer.appendChild(particle);
  }
}

// Setup event listeners
function setupEventListeners() {
  const analyzeBtn = document.getElementById("analyzeBtn");
  analyzeBtn.addEventListener("click", startAnalysis);
}

function updateGameStats() {
  document.getElementById("level").textContent = gameState.level;
  document.getElementById("xp").textContent = gameState.xp;
  document.getElementById("streak").textContent = gameState.streak;
  document.getElementById("totalScore").textContent = gameState.totalScore;
  document.getElementById("coins").textContent = gameState.coins;
}

function saveGameState() {
  localStorage.setItem("accessquest_level", gameState.level);
  localStorage.setItem("accessquest_xp", gameState.xp);
  localStorage.setItem("accessquest_streak", gameState.streak);
  localStorage.setItem("accessquest_total_score", gameState.totalScore);
  localStorage.setItem("accessquest_last_analysis", gameState.lastAnalysisDate);
  localStorage.setItem("accessquest_achievements", JSON.stringify(gameState.achievements));
  // Save new gamification elements
  localStorage.setItem("accessquest_coins", gameState.coins);
  localStorage.setItem("accessquest_badges", JSON.stringify(gameState.badges));
  localStorage.setItem("accessquest_quests_completed", gameState.questsCompleted);
  localStorage.setItem("accessquest_power_ups", JSON.stringify(gameState.powerUps));
}

function checkStreak() {
  const today = new Date().toDateString();
  const lastAnalysis = gameState.lastAnalysisDate;

  if (lastAnalysis) {
    const lastDate = new Date(lastAnalysis);
    const todayDate = new Date(today);
    const daysDiff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

    if (daysDiff > 1) {
      gameState.streak = 0;
    }
  }
}

function addXP(amount) {
  // Add sound effect for XP gain
  playSound('xp');
  
  // Animate XP number
  animateValue("xp", gameState.xp, gameState.xp + amount, 1000);
  
  gameState.xp += amount;
  const xpForNextLevel = gameState.level * 100;

  if (gameState.xp >= xpForNextLevel) {
    levelUp();
  }

  saveGameState();
  updateGameStats();
}

// Add coins function
function addCoins(amount) {
  // Add sound effect for coin gain
  playSound('coin');
  
  // Animate coin number
  animateValue("coins", gameState.coins, gameState.coins + amount, 1000);
  
  gameState.coins += amount;
  saveGameState();
}

// Play sound effects
function playSound(type) {
  // In a real implementation, this would play actual sounds
  console.log(`Playing ${type} sound`);
}

// Animate value changes
function animateValue(id, start, end, duration) {
  const element = document.getElementById(id);
  if (!element) return;
  
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

function levelUp() {
  // Play level up sound
  playSound('levelUp');
  
  gameState.level += 1;
  gameState.xp = 0;

  // Create confetti effect
  createConfetti();

  // Show level up notification
  document.getElementById("newLevel").textContent = gameState.level;
  const levelUpDiv = document.getElementById("levelUpNotification");
  levelUpDiv.style.display = "block";

  setTimeout(() => {
    levelUpDiv.style.display = "none";
  }, 3000);

  // Award level up achievement
  addAchievement(`Level ${gameState.level} Master`, `Reached level ${gameState.level}!`);
  
  // Award badge for reaching certain levels
  if (gameState.level === 5) {
    addBadge('novice', 'Novice Accessibility Expert');
  } else if (gameState.level === 10) {
    addBadge('intermediate', 'Intermediate Accessibility Expert');
  } else if (gameState.level === 20) {
    addBadge('advanced', 'Advanced Accessibility Expert');
  } else if (gameState.level === 50) {
    addBadge('master', 'Master of Accessibility');
  }
}

// Create confetti effect for celebrations
function createConfetti() {
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.backgroundColor = getRandomColor();
    confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
    document.body.appendChild(confetti);
    
    // Remove confetti after animation
    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }
}

// Get random color for confetti
function getRandomColor() {
  const colors = [
    '#8a2be2', // Purple
    '#9370db', // Medium Purple
    '#b19cd9', // Light Purple
    '#ffd700', // Gold
    '#ff9800', // Orange
    '#4caf50', // Green
    '#2196f3'  // Blue
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Add badge system
function addBadge(id, name) {
  if (!gameState.badges.find(b => b.id === id)) {
    gameState.badges.push({ id, name, date: new Date() });
    showBadgeNotification(name);
    saveGameState();
  }
}

// Show badge notification
function showBadgeNotification(name) {
  // Create a badge notification element
  const notification = document.createElement('div');
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.background = 'linear-gradient(45deg, #8a2be2, #9370db)';
  notification.style.color = 'white';
  notification.style.padding = '15px';
  notification.style.borderRadius = '10px';
  notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
  notification.style.zIndex = '1000';
  notification.style.animation = 'slideIn 0.5s ease-out';
  notification.innerHTML = `<strong>🏅 New Badge Unlocked!</strong><br>${name}`;
  
  document.body.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.5s ease-in';
    setTimeout(() => notification.remove(), 500);
  }, 5000);
  
  // Add CSS for animations if not already present
  if (!document.getElementById('badge-animations')) {
    const style = document.createElement('style');
    style.id = 'badge-animations';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Update badges display
  displayBadges();
}

// Display badges in the badges section
function displayBadges() {
  const badgesList = document.getElementById('badgesList');
  if (!badgesList) return;
  
  badgesList.innerHTML = '';
  
  if (gameState.badges.length === 0) {
    badgesList.innerHTML = '<p>No badges earned yet. Complete quests to earn badges!</p>';
    return;
  }
  
  const badgeIcons = {
    'novice': '🥉',
    'intermediate': '🥈',
    'advanced': '🥇',
    'master': '👑'
  };
  
  gameState.badges.forEach(badge => {
    const badgeElement = document.createElement('div');
    badgeElement.className = 'badge-item';
    
    const icon = badgeIcons[badge.id] || '🏅';
    badgeElement.innerHTML = `
      <span class="badge-icon">${icon}</span>
      <span>${badge.name}</span>
    `;
    
    badgesList.appendChild(badgeElement);
  });
}

function addAchievement(title, description) {
  if (!gameState.achievements.find((a) => a.title === title)) {
    gameState.achievements.push({ title, description, date: new Date() });
    showNewAchievement(title);
  }
}

function showNewAchievement(title) {
  const achievementsSection = document.getElementById("achievements");
  const achievementsList = document.getElementById("achievementsList");

  const badge = document.createElement("div");
  badge.className = "achievement-badge";
  badge.textContent = title;
  achievementsList.appendChild(badge);

  achievementsSection.style.display = "block";
  
  // Play achievement sound
  playSound('achievement');
}

// Accessibility analysis simulation
function startAnalysis() {
  const url = document.getElementById("urlInput").value;

  if (!url) {
    alert("Please enter a URL to analyze");
    return;
  }

  if (!isValidUrl(url)) {
    alert("Please enter a valid URL (e.g., https://example.com)");
    return;
  }

  // Update streak
  const today = new Date().toDateString();
  if (gameState.lastAnalysisDate !== today) {
    if (gameState.lastAnalysisDate) {
      const lastDate = new Date(gameState.lastAnalysisDate);
      const todayDate = new Date(today);
      const daysDiff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        gameState.streak += 1;
        // Add streak bonus
        if (gameState.streak % 5 === 0) {
          addCoins(50); // Bonus coins for maintaining streak
          showNotification(`🔥 ${gameState.streak} Day Streak! +50 coins`);
        }
      } else if (daysDiff > 1) {
        gameState.streak = 1;
      }
    } else {
      gameState.streak = 1;
    }
    gameState.lastAnalysisDate = today;
  }

  // Show loading state
  document.getElementById("analyzeBtn").disabled = true;
  document.getElementById("loadingSection").style.display = "block";
  document.getElementById("progressBar").style.display = "block";

  // Increment quests completed
  gameState.questsCompleted++;
  saveGameState();

  // Simulate analysis progress
  simulateAnalysis(url);
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.left = '50%';
  notification.style.transform = 'translateX(-50%)';
  notification.style.background = 'linear-gradient(45deg, #8a2be2, #9370db)';
  notification.style.color = 'white';
  notification.style.padding = '15px 25px';
  notification.style.borderRadius = '30px';
  notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
  notification.style.zIndex = '1000';
  notification.style.animation = 'fadeInOut 4s ease-in-out';
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Remove after 4 seconds
  setTimeout(() => notification.remove(), 4000);
  
  // Add CSS for animations if not already present
  if (!document.getElementById('notification-animations')) {
    const style = document.createElement('style');
    style.id = 'notification-animations';
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -20px); }
        15% { opacity: 1; transform: translate(-50%, 0); }
        85% { opacity: 1; transform: translate(-50%, 0); }
        100% { opacity: 0; transform: translate(-50%, -20px); }
      }
    `;
    document.head.appendChild(style);
  }
}

function simulateAnalysis(url) {
  let progress = 0;
  const progressBar = document.getElementById("progressFill");

  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 100) progress = 100;

    progressBar.style.width = progress + "%";

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        showResults(generateMockResults(url));
      }, 500);
    }
  }, 200);
}

function generateMockResults(url) {
  // Generate realistic accessibility issues based on common problems
  const commonIssues = [
    {
      type: "critical",
      title: "Missing Alt Text",
      description:
        "Found 3 images without alternative text. This prevents screen readers from describing images to visually impaired users.",
      impact: "High",
      fix: "Add descriptive alt attributes to all images.",
    },
    {
      type: "major",
      title: "Low Color Contrast",
      description:
        "Text with insufficient color contrast detected. This makes content difficult to read for users with visual impairments.",
      impact: "Medium",
      fix: "Increase contrast ratio to meet WCAG AA standards (4.5:1).",
    },
    {
      type: "major",
      title: "Missing Form Labels",
      description:
        "Form inputs found without associated labels. Screen reader users cannot understand what information is required.",
      impact: "Medium",
      fix: "Add proper label elements or aria-label attributes to all form controls.",
    },
    {
      type: "minor",
      title: "Missing Skip Links",
      description:
        "No skip navigation links found. Keyboard users must tab through all navigation items to reach main content.",
      impact: "Low",
      fix: 'Add a "Skip to main content" link at the beginning of the page.',
    },
    {
      type: "minor",
      title: "Missing Heading Structure",
      description:
        "Heading hierarchy is not properly structured. This makes navigation difficult for screen reader users.",
      impact: "Low",
      fix: "Ensure headings follow a logical hierarchy (h1 > h2 > h3, etc.).",
    },
    {
      type: "critical",
      title: "Keyboard Trap",
      description:
        "Found elements that trap keyboard focus, preventing users from navigating away using keyboard only.",
      impact: "High",
      fix: "Ensure all interactive elements can be navigated to and away from using keyboard.",
    },
    {
      type: "major",
      title: "ARIA Attributes Misuse",
      description:
        "Improper use of ARIA attributes detected that may confuse screen readers.",
      impact: "Medium",
      fix: "Review and correct ARIA attributes according to WAI-ARIA specifications.",
    },
  ];

  // Randomly select 2-4 issues
  const selectedIssues = commonIssues
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 3) + 2);

  // Calculate score based on issues
  let score = 100;
  selectedIssues.forEach((issue) => {
    if (issue.type === "critical") score -= 25;
    else if (issue.type === "major") score -= 15;
    else score -= 5;
  });

  score = Math.max(score, 0);

  return {
    url,
    score,
    issues: selectedIssues,
    timestamp: new Date(),
  };
}

function showResults(results) {
  // Hide loading
  document.getElementById("loadingSection").style.display = "none";
  document.getElementById("progressBar").style.display = "none";
  document.getElementById("analyzeBtn").disabled = false;

  // Show results section
  document.getElementById("resultsSection").style.display = "block";

  // Calculate XP earned
  const baseXP = 50;
  const bonusXP = Math.floor(results.score / 10) * 5;
  const streakBonus = gameState.streak * 5;
  const totalXP = baseXP + bonusXP + streakBonus;
  
  // Calculate coins earned
  const baseCoins = 10;
  const bonusCoins = Math.floor(results.score / 20) * 5;
  const totalCoins = baseCoins + bonusCoins;
  
  // Add coins
  addCoins(totalCoins);

  // Update score
  gameState.totalScore += results.score;

  // Show quest complete
  document.getElementById("earnedXP").textContent = totalXP;
  document.getElementById("earnedCoins").textContent = totalCoins;
  document.getElementById("questComplete").style.display = "block";

  // Display score
  displayScore(results.score);

  // Display issues
  displayIssues(results.issues);

  // Award XP and check for achievements
  addXP(totalXP);
  checkAchievements(results);

  // Save results
  saveGameState();
}

function displayScore(score) {
  const scoreCircle = document.getElementById("scoreCircle");
  const scoreValue = document.getElementById("scoreValue");
  const scoreTitle = document.getElementById("scoreTitle");
  const scoreDescription = document.getElementById("scoreDescription");

  // Animate score value
  animateValue("scoreValue", 0, score, 1500);

  if (score >= 90) {
    scoreCircle.className = "score-circle score-excellent";
    scoreTitle.textContent = "Excellent Accessibility!";
    scoreDescription.textContent = "Your website is highly accessible!";
  } else if (score >= 70) {
    scoreCircle.className = "score-circle score-good";
    scoreTitle.textContent = "Good Accessibility";
    scoreDescription.textContent =
      "Good job! A few improvements will make it even better.";
  } else if (score >= 50) {
    scoreCircle.className = "score-circle score-fair";
    scoreTitle.textContent = "Fair Accessibility";
    scoreDescription.textContent =
      "There's room for improvement. Focus on critical issues first.";
  } else {
    scoreCircle.className = "score-circle score-poor";
    scoreTitle.textContent = "Needs Improvement";
    scoreDescription.textContent =
      "Several accessibility issues need attention.";
  }
}

function displayIssues(issues) {
  const issuesGrid = document.getElementById("issuesGrid");
  issuesGrid.innerHTML = "";

  issues.forEach((issue) => {
    const issueCard = document.createElement("div");
    issueCard.className = `issue-card issue-${issue.type}`;
    issueCard.setAttribute('data-issue', issue.title);

    issueCard.innerHTML = `
      <div class="issue-header">
        <h4>${issue.title}</h4>
        <span class="issue-type type-${issue.type}">${issue.type.toUpperCase()}</span>
      </div>
      <div class="issue-description">${issue.description}</div>
      <div style="margin-top: 15px;">
        <strong>Impact:</strong> ${issue.impact}<br>
        <strong>Fix:</strong> ${issue.fix}
      </div>
      <button class="fix-button" onclick="showFixDetails('${issue.title}')">Learn How to Fix</button>
    `;

    // Add animation to issue cards
    issueCard.style.animation = `fadeIn 0.5s ease-out ${issues.indexOf(issue) * 0.2}s both`;
    
    issuesGrid.appendChild(issueCard);
  });
  
  // Add CSS for animations if not already present
  if (!document.getElementById('issue-animations')) {
    const style = document.createElement('style');
    style.id = 'issue-animations';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
}

function showFixDetails(issueTitle) {
  // In a real implementation, this would show detailed fix instructions
  alert(
    `Detailed fix guide for "${issueTitle}" would be shown here. This could link to specific WCAG guidelines and code examples.`
  );
}

function checkAchievements(results) {
  // First analysis achievement
  if (gameState.totalScore === results.score) {
    addAchievement(
      "First Quest",
      "Completed your first accessibility analysis!"
    );
  }

  // Perfect score achievement
  if (results.score === 100) {
    addAchievement(
      "Accessibility Champion",
      "Achieved a perfect accessibility score!"
    );
  }

  // High score achievement
  if (results.score >= 90) {
    addAchievement(
      "Accessibility Expert",
      "Scored 90% or higher on accessibility!"
    );
  }

  // Streak achievements
  if (gameState.streak >= 7) {
    addAchievement("Weekly Warrior", "Maintained a 7-day streak!");
  }

  if (gameState.streak >= 30) {
    addAchievement("Monthly Master", "Maintained a 30-day streak!");
  }
  
  // Quest completion achievements
  if (gameState.questsCompleted >= 5) {
    addAchievement("Quest Hunter", "Completed 5 accessibility quests!");
  }
  
  if (gameState.questsCompleted >= 25) {
    addAchievement("Quest Master", "Completed 25 accessibility quests!");
  }
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Make functions available globally
window.startAnalysis = startAnalysis;
window.showFixDetails = showFixDetails;

// Initialize the game when page loads
window.onload = function () {
  initializeGame();
};