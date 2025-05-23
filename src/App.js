import React, { useState, useEffect } from 'react';
import './App.css';

// 模拟后台数据 - 菌菇题库
// round1
const mushroomQuestions1 = [
  {
    id: 1,
    image: '/images/songrong.jpeg',
    question: '这是什么菌菇?',
    options: ['松茸', '香菇', '猴头菇', '金针菇'],
    answer: '松茸'
  },
  {
    id: 2,
    image: '/images/xianggu.jpg',
    question: '这是什么菌菇?',
    options: ['松茸', '香菇', '猴头菇', '金针菇'],
    answer: '香菇'
  },
  {
    id: 3,
    image: '/images/houtougu.jpg',
    question: '这是什么菌菇?',
    options: ['松茸', '香菇', '猴头菇', '金针菇'],
    answer: '猴头菇'
  },
  {
    id: 4,
    image: '/images/jinzhengu.jpg',
    question: '这是什么菌菇?',
    options: ['松茸', '香菇', '猴头菇', '金针菇'],
    answer: '金针菇'
  }
];

// round2
const mushroomQuestions2 = [
  {
    id: 1,
    image: '/images/daqingzhesan.jpg',
    question: '这是什么菌菇?',
    options: ['大青褶伞', '马勃', '墨汁鬼伞', '双胞蘑菇'],
    answer: '大青褶伞'
  },
  {
    id: 2,
    image: '/images/mabo.jpg',
    question: '这是什么菌菇?',
    options: ['大青褶伞', '马勃', '墨汁鬼伞', '双胞蘑菇'],
    answer: '马勃'
  },
  {
    id: 3,
    image: '/images/mozhiguisan.jpg',
    question: '这是什么菌菇?',
    options: ['大青褶伞', '马勃', '墨汁鬼伞', '双胞蘑菇'],
    answer: '墨汁鬼伞'
  },
  {
    id: 4,
    image: '/images/shuangbaomogu.jpg',
    question: '这是什么菌菇?',
    options: ['大青褶伞', '马勃', '墨汁鬼伞', '双胞蘑菇'],
    answer: '双胞蘑菇'
  }
];

const mushroomQuestions3 = [
  {
    id: 1,
    image: '/images/zhanmao.jpg',
    question: '这是什么菌菇?',
    options: ['毡毛小脆柄菇', '平菇', '大球盖菇', '灵芝'],
    answer: '毡毛小脆柄菇'
  },
  {
    id: 2,
    image: '/images/pinggu.jpg',
    question: '这是什么菌菇?',
    options: ['毡毛小脆柄菇', '平菇', '大球盖菇', '灵芝'],
    answer: '平菇'
  },
  {
    id: 3,
    image: '/images/daqiu.jpg',
    question: '这是什么菌菇?',
    options: ['毡毛小脆柄菇', '平菇', '大球盖菇', '灵芝'],
    answer: '大球盖菇'
  },
  {
    id: 4,
    image: '/images/lingzhi.jpg',
    question: '这是什么菌菇?',
    options: ['毡毛小脆柄菇', '平菇', '大球盖菇', '灵芝'],
    answer: '灵芝'
  }
];

// 将所有题目集合到一个数组中
const allRounds = [mushroomQuestions1, mushroomQuestions2, mushroomQuestions3];

// Fisher-Yates 洗牌算法，用于生成随机排列
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 添加预加载函数
const preloadImages = (questions) => {
  questions.forEach(q => {
    const img = new Image();
    img.src = q.image;
  });
};

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [questionOrder, setQuestionOrder] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [currentRound, setCurrentRound] = useState(0); // 当前题库轮次，0表示第一轮
  const [score, setScore] = useState(0); // 记录分数
  const [gameOver, setGameOver] = useState(false); // 游戏是否结束
  const totalQuestions = allRounds.reduce((total, round) => total + round.length, 0); // 总题目数

  // 组件挂载时生成题目的随机排列
  useEffect(() => {
    if (!gameOver) {
      generateQuestionOrder();
      // 预加载当前轮次的图片
      preloadImages(allRounds[currentRound]);
    }
  }, [currentRound, gameOver]);

  // 根据当前索引更新题目
  useEffect(() => {
    if (questionOrder.length > 0 && !gameOver) {
      const questionId = questionOrder[currentIndex];
      // 根据当前轮次选择对应的题库
      const question = allRounds[currentRound].find(q => q.id === questionId);
      setCurrentQuestion(question);
    }
  }, [questionOrder, currentIndex, currentRound, gameOver]);

  // 生成题目的随机排列
  const generateQuestionOrder = () => {
    // 创建题目ID数组
    const questionIds = allRounds[currentRound].map(q => q.id);
    // 随机排列题目ID
    const shuffledIds = shuffleArray(questionIds);
    setQuestionOrder(shuffledIds);
    setCurrentIndex(0);
  };

  // 处理选项选择
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    const isCorrect = option === currentQuestion.answer;
    
    if (isCorrect) {
      setResult('正确！');
      setScore(prev => prev + 1); // 答对加一分
    } else {
      setResult(`错误！正确答案是：${currentQuestion.answer}`);
    }
    setShowResult(true);
  };

  // 下一题
  const handleNextQuestion = () => {
    // 如果当前是最后一题
    if (currentIndex === questionOrder.length - 1) {
      // 完成一轮答题
      const newCompletedRounds = completedRounds + 1;
      setCompletedRounds(newCompletedRounds);
      
      // 如果已完成所有3轮题目，游戏结束
      if (currentRound === allRounds.length - 1) {
        setGameOver(true);
      } else {
        // 移至下一轮题目
        setCurrentRound(prev => prev + 1);
      }
    } else {
      // 移至下一题
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
    
    // 重置选项和结果
    setSelectedOption(null);
    setShowResult(false);
    setResult(null);
  };

  // 重新开始游戏
  const restartGame = () => {
    setScore(0);
    setCurrentRound(0);
    setCompletedRounds(0);
    setCurrentIndex(0);
    setGameOver(false);
    setSelectedOption(null);
    setShowResult(false);
    setResult(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>菌菇知识竞猜</h1>
        
        {!gameOver ? (
          <>
            <p className="progress-info">第 {currentRound + 1} 组题目 · 题目 {currentIndex + 1}/{questionOrder.length} · 当前得分: {score}/{totalQuestions}</p>
            {currentQuestion && (
              <div className="question-container">
                <div className="image-container">
                  <img src={currentQuestion.image} alt="菌菇图片" className="mushroom-image" />
                </div>
                <h2>{currentQuestion.question}</h2>
                <div className="options-container">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(option)}
                      className={`option-button ${selectedOption === option ? (option === currentQuestion.answer ? 'correct' : 'wrong') : ''}`}
                      disabled={showResult}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {showResult && (
                  <div className={`result ${result.includes('正确') ? 'correct-result' : 'wrong-result'}`}>
                    <p>{result}</p>
                    <button onClick={handleNextQuestion} className="next-button">下一题</button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="game-over">
            <h2>测验完成！</h2>
            <p className="score-summary">您的最终得分: {score}/{totalQuestions}</p>
            <p className="score-percentage">正确率: {Math.round((score / totalQuestions) * 100)}%</p>
            <button onClick={restartGame} className="restart-button">重新开始</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
