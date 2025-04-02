/**
 * ui-manager.js 在画布上绘制 UI，包括清屏、绘制随机成语、选项、分数和当前级别
 * @param {CanvasRenderingContext2D} ctx - 画布的 2D 绘图上下文
 * @param {HTMLCanvasElement} canvas - 画布对象
 * @param {string} currentIdiom - 当前要绘制的随机成语
 * @param {string[]} options - 供用户选择的选项
 * @param {number} score - 当前的分数
 * @param {string} currentLevel - 当前的级别
 */
export function drawUI(ctx, canvas, currentIdiom, options, score, currentLevel) {
    // 设置填充颜色为白色，用于清屏
    ctx.fillStyle = '#ffffff';
    // 绘制一个白色矩形覆盖整个画布，实现清屏效果
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 计算要绘制的成语的字体大小，为画布宽度的十分之一
    const fontSize = Math.floor(canvas.width / 10);

    // 设置填充颜色为黑色，用于绘制文字
    ctx.fillStyle = '#000000';
    // 设置字体样式，根据平台选择不同字体
    ctx.font = `bold ${fontSize}px ${tt.getSystemInfoSync().platform === 'devtools' ? 'Arial' : '"楷体"'}`;
    // 设置文字水平居中对齐
    ctx.textAlign = 'center';
    // 设置文字垂直居中对齐
    ctx.textBaseline = 'middle';

    // 遍历成语中的每个字符并绘制
    const charWidth = ctx.measureText('一').width;
    const startX = canvas.width / 2 - (currentIdiom.length * charWidth) / 2;
    for (let i = 0; i < currentIdiom.length; i++) {
        const char = currentIdiom[i];
        const x = startX + i * charWidth;
        ctx.fillText(char, x, canvas.height / 2);
    }

    // 绘制选项
    const optionWidth = canvas.width / 4;
    const optionHeight = optionWidth * 0.5;
    const optionY = canvas.height * 0.7;
    for (let i = 0; i < options.length; i++) {
        const optionX = i * optionWidth;
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(optionX, optionY, optionWidth, optionHeight);
        ctx.fillStyle = '#000000';
        ctx.fillText(options[i], optionX + optionWidth / 2, optionY + optionHeight / 2);
    }

    // 绘制分数，距离顶端 80 像素
    ctx.font = '20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`分数: ${score}`, canvas.width - 20, 80);

    // 绘制当前级别
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`当前级别: ${currentLevel}`, 20, 80);
}
    