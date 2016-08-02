export default function toggleElement (btn, display) {
  btn.addEventListener('click', () => {
    display.classList.toggle('_active');
  })
}
