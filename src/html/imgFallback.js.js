// src/directives/imgFallback.js
const imgFallback = {
  mounted(el, binding) {
    const fallbackColor = binding.value || '#f0f0f0'; // 默认颜色值

    // 创建一个背景色的 div
    const fallbackDiv = document.createElement('div');

    // 拷贝原始图像的 classList
    fallbackDiv.className = el.className; // 拷贝 class

    // 拷贝原始图像的所有属性
    Array.from(el.attributes).forEach(attr => {
      fallbackDiv.setAttribute(attr.name, attr.value);
    });

    fallbackDiv.style.width = `${el.width}px`; // 设置宽度
    fallbackDiv.style.height = `${el.height}px`; // 设置高度
    fallbackDiv.style.backgroundColor = fallbackColor; // 设置背景色
    fallbackDiv.style.display = 'none'; // 初始隐藏
    fallbackDiv.style.justifyContent = 'center'; // 居中对齐
    fallbackDiv.style.alignItems = 'center'; // 垂直居中
    fallbackDiv.style.position = 'relative'; // 使其相对定位
    fallbackDiv.style.display = 'flex'; // 使用 Flexbox 居中内容

    el.parentNode.insertBefore(fallbackDiv, el); // 在 img 之前插入 div

    // 设置图像的 onerror 事件处理
    const handleError = () => {
      el.style.display = 'none'; // 隐藏图像
      fallbackDiv.style.display = 'flex'; // 显示默认图标
    };

    // 监听图像加载失败
    el.onerror = handleError;

    // 设置图像的 src 属性
    el.src = el.src || ''; // 如果没有 src，则保持为空

    // 使用 MutationObserver 监听 src 属性变化
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
          // 每次 src 属性变化后重置状态
          el.style.display = 'block'; // 重置为可见状态
          fallbackDiv.style.display = 'none'; // 隐藏 fallback div

          // 检查新 src 是否有效
          const img = new Image();
          img.src = el.src; // 使用新 src 进行加载
          img.onload = () => {
            // 如果成功加载，确保图像可见
            el.style.display = 'block';
            fallbackDiv.style.display = 'none';
          };
          img.onerror = handleError; // 加载失败时调用错误处理
        }
      });
    });

    // 开始观察 src 属性
    observer.observe(el, { attributes: true });

    // 在指令销毁时断开观察
    el._observer = observer; // 保存观察者实例，以便后续清理
  },
  beforeUnmount(el) {
    // 清理观察者
    if (el._observer) {
      el._observer.disconnect();
      delete el._observer; // 删除观察者实例
    }
  },
};

export default imgFallback;