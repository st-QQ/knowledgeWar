// 从 idiom-manager.js 文件中导入 getRandomIdiom 函数和 idiomLevels 对象，用于获取随机成语和所有成语数据
import { getRandomIdiom, idiomLevels } from './modules/core/idiom-manager.js';
// 从 ui-manager.js 文件中导入 drawUI 函数，用于绘制 UI
import { drawUI } from './modules/ui/ui-manager.js';

// 使用 tt.getSystemInfoSync 方法同步获取系统信息
const systemInfo = tt.getSystemInfoSync();
// 创建一个画布对象
const canvas = tt.createCanvas();
// 获取画布的 2D 绘图上下文
const ctx = canvas.getContext('2d');
// 设置画布的宽度为系统窗口的宽度
canvas.width = systemInfo.windowWidth;
// 设置画布的高度为系统窗口的高度
canvas.height = systemInfo.windowHeight;

// 初始化分数
let score = 0;
// 初始化级别，从小班开始
let currentLevel = '小班';
// 答对题目计数，用于升级判断
let correctAnswerCount = 0;

// 生成带有填空的成语和选项
function generateIdiomWithBlank() {
    const idiom = getRandomIdiom(currentLevel);
    const randomIndex = Math.floor(Math.random() * idiom.length);
    const idiomWithBlank = idiom.split('');
    const missingChar = idiom[randomIndex];
    idiomWithBlank[randomIndex] = '□';

    const allChars = Object.values(idiomLevels).flatMap(level => level.flatMap(idiom => idiom.split('')));
    const options = [missingChar];
    while (options.length < 4) {
        const randomChar = allChars[Math.floor(Math.random() * allChars.length)];
        if (!options.includes(randomChar)) {
            options.push(randomChar);
        }
    }
    // 打乱选项顺序
    options.sort(() => Math.random() - 0.5);

    return {
        idiomWithBlank: idiomWithBlank.join(''),
        missingChar,
        options
    };
}

// 处理题目生成和绘制，同时保存当前题目信息
function handleQuestionGeneration() {
    const { idiomWithBlank, missingChar, options } = generateIdiomWithBlank();
    drawUI(ctx, canvas, idiomWithBlank, options, score, currentLevel);

    // 移除之前的触摸结束事件监听器
    tt.offTouchEnd();

    // 监听用户点击选项事件
    tt.onTouchEnd((e) => {
        const touchX = e.changedTouches[0].clientX;
        const touchY = e.changedTouches[0].clientY;
        const optionWidth = canvas.width / 4;
        const optionY = canvas.height * 0.7;
        for (let i = 0; i < options.length; i++) {
            const optionX = i * optionWidth;
            if (
                touchX >= optionX &&
                touchX <= optionX + optionWidth &&
                touchY >= optionY &&
                touchY <= optionY + optionWidth * 0.5
            ) {
                const selectedOption = options[i];
                let resultMessage = '';
                if (selectedOption === missingChar) {
                    resultMessage = '回答正确！';
                    ctx.fillStyle = 'green';
                    score++;
                    correctAnswerCount++;
                    // 每答对 5 题升级
                    if (correctAnswerCount % 5 === 0) {
                        const levels = Object.keys(idiomLevels);
                        const currentLevelIndex = levels.indexOf(currentLevel);
                        if (currentLevelIndex < levels.length - 1) {
                            currentLevel = levels[currentLevelIndex + 1];
                        }
                    }
                } else {
                    resultMessage = '回答错误！';
                    ctx.fillStyle = 'red';
                    score--;
                    // 答错降级
                    const levels = Object.keys(idiomLevels);
                    const currentLevelIndex = levels.indexOf(currentLevel);
                    if (currentLevelIndex > 0) {
                        currentLevel = levels[currentLevelIndex - 1];
                    }
                }
                ctx.font = '30px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(resultMessage, canvas.width / 2, canvas.height * 0.9);

                // 回答判断完成后，生成新的题目
                setTimeout(() => {
                    handleQuestionGeneration();
                }, 1500);
                break;
            }
        }
    });
}

// 初始调用 handleQuestionGeneration 函数
handleQuestionGeneration();
    