// Đợi DOM sẵn sàng để tránh null
document.addEventListener('DOMContentLoaded', () => {
  // ===== Hearts =====
  function spawnHearts() {
    for (let i = 0; i < 3; i++) {
      const el = document.createElement('div');
      el.className = 'heart'; el.textContent = '💕';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.animationDuration = (5 + Math.random() * 4) + 's';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 10000);
    }
  }
  setInterval(spawnHearts, 1200);

  // // ===== Audio gesture =====
  // addEventListener('click',()=>{
  //   const a=document.getElementById('bgMusic');
  //   if (a) { a.muted=false; a.play().catch(()=>{}); }
  // }, {once:true});

  // ===== Countdown =====
  const dd = document.getElementById('dd'),
    hh = document.getElementById('hh'),
    mm = document.getElementById('mm'),
    ss = document.getElementById('ss');

  // 🎯 Đặt đúng ngày cưới: 01/11/2025 (giờ Việt Nam)
  const target = new Date('2025-11-01T00:00:00+07:00').getTime();

  if (dd && hh && mm && ss) {
    setInterval(() => {
      const now = Date.now();
      let d = Math.max(0, target - now);

      const days = Math.floor(d / 86400000); // 1 ngày = 86400000 ms
      d %= 86400000;

      const hours = Math.floor(d / 3600000);
      d %= 3600000;

      const mins = Math.floor(d / 60000);
      d %= 60000;

      const secs = Math.floor(d / 1000);

      dd.textContent = String(days).padStart(2, '0');
      hh.textContent = String(hours).padStart(2, '0');
      mm.textContent = String(mins).padStart(2, '0');
      ss.textContent = String(secs).padStart(2, '0');
    }, 1000);
  }

  // ===== Gallery builder =====
  const grid = document.querySelector('#gallery .gallery');
  const tplEl = document.getElementById('tpl-img');
  const tpl = tplEl?.content?.firstElementChild || null;

  const images = [
    'DSC00008.jpg', 'DSC00045.jpg', 'DSC00087.jpg', 'DSC08967.jpg', 'DSC08977.jpg', 'DSC08998.jpg', 'DSC09115.jpg', 'DSC09175.jpg', 'DSC09193.jpg', 'DSC09240.jpg', 'DSC09307.jpg', 'DSC09355.jpg', 'DSC09388.jpg', 'DSC09456.jpg', 'DSC09599.jpg', 'DSC09647.jpg', 'DSC09683.jpg', 'DSC09727.jpg', 'DSC09748.jpg', 'DSC09752.jpg', 'DSC09870.jpg', 'DSC09917.jpg', 'DSC09987.jpg', 'DSC099700.jpg' // <- kiểm tra tên này
  ];

  if (grid && tpl) {
    images.forEach(name => {
      const node = tpl.cloneNode(true);
      const img = node.querySelector('img');
      img.src = './images/' + name; img.alt = name;
      img.onerror = () => node.remove(); // ảnh sai tên sẽ bị loại khỏi DOM
      grid.appendChild(node);
    });
  } else {
    console.warn('Gallery template/grid not found');
  }

  // ===== Gift modal controls (guard bootstrap) =====
  const giftBtn = document.getElementById('giftBtn');
  const Modal = window.bootstrap?.Modal;
  if (giftBtn && Modal) {
    giftBtn.addEventListener('click', () => new Modal('#giftModal').show());
  } else if (!window.bootstrap) {
    console.warn('Bootstrap chưa tải – kiểm tra thẻ <script> CDN.');
  }

  // ==== Helpers: copy & download (có fallback) ====
  window.copyText = (t) => {
    const viaClipboard = !!(navigator.clipboard && location.protocol.startsWith('https'));
    (viaClipboard ? navigator.clipboard.writeText(t) : Promise.reject())
      .then(() => alert('Đã copy: ' + t))
      .catch(() => {
        // Fallback cho http/file://
        const ta = document.createElement('textarea');
        ta.value = t; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); alert('Đã copy: ' + t); }
        catch { prompt('Copy thủ công nội dung sau:', t); }
        finally { ta.remove(); }
      });
  };

  window.downloadImg = (src) => {
    const a = document.createElement('a'); a.href = src; a.download = src.split('/').pop(); document.body.appendChild(a);
    a.click(); a.remove();
  };
});


// 🎵 MUSIC TOGGLE FUNCTION
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicToggle");

// Bật nhạc tự động khi click lần đầu (do trình duyệt chặn autoplay)
musicBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.muted = false;
    bgMusic.play();
    musicBtn.classList.add("playing");
    musicBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  } else {
    bgMusic.pause();
    musicBtn.classList.remove("playing");
    musicBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
  }
});

// Gợi ý: Bật nhạc tự động khi user tương tác lần đầu trên trang
document.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.muted = false;
    bgMusic.play().catch(() => { });
  }
}, { once: true });

const scriptURL = "https://script.google.com/macros/s/AKfycbzcvU8U75qMH0NjRTW8V4LJKX56h4VrNjkxH7ulpUei7gAwfhYLiMxf0as0A6yZRpsl/exec";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("rsvpForm");
  if (!form) return console.error("Không tìm thấy form RSVP!");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fd = new FormData(form); // lấy theo name="..."
    try {
      // KHÔNG set Content-Type, KHÔNG gửi JSON → tránh preflight
      await fetch(scriptURL, { method: "POST", body: fd });
      form.reset();
      showPopup && showPopup();
    } catch (err) {
      console.error(err);
      alert("❌ Không thể gửi dữ liệu. Vui lòng thử lại!");
    }
  });
});
// 🎉 Hiển thị popup cảm ơn
function showPopup() {
  const popup = document.getElementById("popupSuccess");
  popup.classList.add("show");

  setTimeout(() => popup.classList.remove("show"), 4000);

  popup.querySelector(".close-btn").addEventListener("click", () => {
    popup.classList.remove("show");
  });
}


