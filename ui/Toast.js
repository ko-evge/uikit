/**
 * UIKit — Toast Component
 *
 * Автоисчезающее уведомление (success/error/info/warning) для обратной связи
 * после API-вызова — сейчас после ошибок пользователь не видит ничего, кроме
 * иногда всплывающего ui.Dialog.alert() (модальный, требует клика). Toast —
 * немодальный, не блокирует ввод, копится стопкой в правом верхнем углу.
 *
 * Единственный контейнер на приложение (как LoadingOverlay в Spinner.js) —
 * повторные show() докладывают в тот же стек, а не плодят новые контейнеры.
 */

let _containerEl = null;

function ensureContainer() {
  if (_containerEl) return _containerEl;
  _containerEl = document.createElement('div');
  _containerEl.className = 'ui-toast-container';
  document.body.appendChild(_containerEl);
  return _containerEl;
}

export const Toast = {
  /**
   * @param {string} message
   * @param {'info'|'success'|'warning'|'error'} [type]
   * @param {number} [duration] — мс до автоскрытия; 0 = не скрывать само (только по клику)
   */
  show(message, type = 'info', duration = 3500) {
    const container = ensureContainer();

    const el = document.createElement('div');
    el.className = `ui-toast ui-toast-${type}`;
    el.textContent = message;
    el.title = 'Click to dismiss';

    const remove = () => {
      el.classList.add('ui-toast-leaving');
      // Ждём анимацию исчезновения (CSS transition), затем убираем из DOM —
      // мгновенный remove() дёргает стек резким скачком.
      setTimeout(() => el.remove(), 200);
    };
    el.addEventListener('click', remove);

    container.appendChild(el);
    if (duration > 0) setTimeout(remove, duration);
    return { dismiss: remove };
  },

  info(message, duration)    { return Toast.show(message, 'info', duration); },
  success(message, duration) { return Toast.show(message, 'success', duration); },
  warning(message, duration) { return Toast.show(message, 'warning', duration); },
  error(message, duration)   { return Toast.show(message, 'error', duration); },
};
