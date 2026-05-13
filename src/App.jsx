import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

/* =========================
   STYLE
========================= */
const floatingStyle = `
@import url('https://fonts.googleapis.com/css2?family=Freckle+Face&family=Henny+Penny&family=Kapakana:wght@300..400&family=Orbit&display=swap');

html {
  scroll-behavior: smooth;
  touch-action: pan-y; /* ✅ FIX: 모바일 좌우 확대 방지 */
}

body {
  overflow-x: hidden;
  background: #fff8fb;
}

@keyframes float {
  0% { transform: translate(-50%, 0px); }
  50% { transform: translate(-50%, -10px); }
  100% { transform: translate(-50%, 0px); }
}

@keyframes profileSwing {
  0% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
  100% { transform: rotate(-2deg); }
}

.fade-section {
  opacity: 0;
  transform: translateY(28px);
  transition: all 1s ease;
}

.fade-section.show {
  opacity: 1;
  transform: translateY(0);
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
`;

/* =========================
   📸 SWIPE GALLERY
========================= */
function SwipeGallery() {
  const images = [
    "/photo5.jpg",
    "/photo8.jpg",
    "/photo11.jpg",
    "/photo6.jpg",
    "/photo17.jpg",
    "/photo16.jpg",
    "/photo15.jpg",
  ];

  const sliderRef = useRef(null);

  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleDown = (pageX) => {
    isDown.current = true;
    startX.current = pageX;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleMove = (pageX) => {
    if (!isDown.current) return;
    const walk = (pageX - startX.current) * 1.2;
    requestAnimationFrame(() => {
      sliderRef.current.scrollLeft = scrollLeft.current - walk;
    });
  };

  const stopDragging = () => {
    isDown.current = false;
  };

  return (
    <div
      ref={sliderRef}
      className="hide-scrollbar"
      onMouseDown={(e) => handleDown(e.pageX)}
      onMouseMove={(e) => {
        if (!isDown.current) return;
        e.preventDefault();
        handleMove(e.pageX);
      }}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      onTouchStart={(e) => handleDown(e.touches[0].pageX)}
      onTouchMove={(e) => handleMove(e.touches[0].pageX)}
      onTouchEnd={stopDragging}
      style={{
        display: "flex",
        overflowX: "auto",
        gap: "10px",
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
        cursor: isDown.current ? "grabbing" : "grab",
        paddingLeft: "12px",
        paddingRight: "12px",
      }}
    >
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          draggable={false}
          style={{
            width: "84%",
            flex: "0 0 auto",
            borderRadius: "18px",
            scrollSnapAlign: "center",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      ))}
    </div>
  );
}

/* =========================
   🖼️ GRID GALLERY
========================= */
function GridGallery() {
  const images = [
    "/photo1.jpg",
    "/photo2.jpg",
    "/photo3.jpg",
    "/photo4.jpg",
    "/photo5.jpg",
    "/photo6.jpg",
    "/photo7.jpg",
    "/photo8.jpg",
    "/photo9.jpg",
    "/photo10.jpg",
    "/photo11.jpg",
    "/photo12.jpg",
    "/photo13.jpg",
    "/photo14.jpg",
    "/photo15.jpg",
  ];

  const [selected, setSelected] = useState(null);

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "4px",
          padding: "0 12px",
        }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            onClick={() => setSelected(src)}
            style={{
              width: "100%",
              aspectRatio: "3 / 4",
              objectFit: "cover",
              borderRadius: "0px",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      {/* ✅ FIX: createPortal로 body에 직접 마운트 → overflow:hidden 클리핑 완전 우회 */}
      {selected && createPortal(
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.96)",
            zIndex: 2147483647,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <img
            src={selected}
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "92vw",
              maxHeight: "92vh",
              objectFit: "contain",
              borderRadius: "12px",
            }}
          />
        </div>,
        document.body
      )}
    </>
  );
}

/* =========================
   ✨ FADE SECTION
========================= */
function FadeInSection({ children, padding = "20px 0" }) {
  const [show, setShow] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setShow(true);
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`fade-section ${show ? "show" : ""}`}
      style={{ padding }}
    >
      {children}
    </section>
  );
}

/* =========================
   📆 DATE INFO
========================= */
function DateInfo() {
  return (
    <FadeInSection padding="40px 0 20px">
      <div style={{ textAlign: "center", fontFamily: "'Orbit', sans-serif", padding: "0 24px" }}>

        <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#aaa", marginBottom: "16px" }}>
          DATE
        </div>

        {/* 카드 */}
        <div style={{
          background: "#fff",
          border: "1px solid #f2e1e6",
          borderRadius: "20px",
          padding: "22px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.05)"
        }}>

          <div style={{ fontSize: "26px", fontWeight: 900, color: "#222", marginBottom: "6px" }}>
            2026 · 10 · 04
          </div>

          <div style={{ fontSize: "13px", letterSpacing: "2px", color: "#666", marginBottom: "18px" }}>
            SUNDAY · 3:00 PM
          </div>

        </div>
      </div>
    </FadeInSection>
  );
}

/* =========================
   📍 LOCATION INFO
========================= */
function LocationInfo() {
  const address = "서울특별시 구로구 경인로 610";

  const copyAddress = () => {
    navigator.clipboard.writeText(address).then(() => {
      alert("주소가 복사되었습니다!");
    }).catch(() => {
      // clipboard API 실패 시 fallback
      const el = document.createElement("textarea");
      el.value = address;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      alert("주소가 복사되었습니다!");
    });
  };

  return (
    <FadeInSection padding="20px 0 0">
      {/* LOCATION 텍스트 */}
      <div style={{ textAlign: "center", padding: "0 24px 24px", fontFamily: "'Orbit', sans-serif" }}>

  <div style={{
    fontSize: "11px",
    letterSpacing: "4px",
    color: "#aaa",
    marginBottom: "16px"
  }}>
    LOCATION
  </div>

  <div style={{
    background: "#fff",
    border: "1px solid #f2e1e6",
    borderRadius: "18px",
    padding: "18px",
    marginBottom: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
  }}>
    <div style={{ fontSize: "16px", fontWeight: 900 }}>
      더 링크 호텔
    </div>
    <div style={{ fontSize: "13px", color: "#666" }}>
      5F · GRAND BALLROOM (가든홀)
    </div>
    <div style={{ fontSize: "12px", color: "#aaa", marginTop: "6px" }}>
      {address}
    </div>
  </div>
        
        
        <button
          onClick={copyAddress}
          style={{
            background: "#D66072",
            color: "#fff",
            border: "none",
            borderRadius: "999px",
            padding: "8px 20px",
            fontSize: "12px",
            fontFamily: "'Orbit', sans-serif",
            letterSpacing: "1px",
            cursor: "pointer",
            marginBottom: "0px",
          }}
        >
          주소 복사하기
        </button>
      </div>

      {/* 지도 이미지 - 클릭 시 네이버 지도 열기 */}
      <a
        href="https://naver.me/FqWtKQUF"
        target="_blank"
        rel="noreferrer"
        style={{ display: "block" }}
      >
        <img
          src="/map_image.png"
          style={{ width: "100%", display: "block" }}
          alt="지도 보기"
        />
      </a>
      <div style={{
        textAlign: "center",
        fontSize: "11px",
        color: "#aaa",
        padding: "8px 0 16px",
        fontFamily: "'Orbit', sans-serif",
        letterSpacing: "0.5px",
      }}>
        이미지를 클릭하면 네이버 지도로 이동합니다
      </div>

      {/* 교통 안내 */}
      <div style={{
        padding: "32px 24px 40px",
        fontFamily: "'Orbit', sans-serif",
        fontSize: "12px",
        lineHeight: 2,
        color: "#444",
      }}>
        {/* 셔틀버스 */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontWeight: 1200, fontSize: "17px", marginBottom: "4px" }}>🚌 셔틀버스</div>
          <div style={{ color: "#666" }}>신도림역 1번 출구</div>
        </div>

        {/* 자가용 */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontWeight: 1200, fontSize: "17px", marginBottom: "4px" }}>🚗 자가용</div>
          <div style={{ color: "#666" }}>1시간 30분 무료 (초과시 15분당 1,000원)</div>
        </div>

        {/* 지하철&버스 */}
        <div>
          <div style={{ fontWeight: 1200, fontSize: "17px", marginBottom: "8px" }}>🚎 지하철 & 버스</div>
          <div style={{ fontWeight: 1200, color: "#666", marginBottom: "4px" }}>1호선 구로역 3번 출구 도보 5분</div>
          <div style={{ fontWeight: 1200, color: "#666", marginBottom: "20px" }}>1, 2호선 신도림역 1번 출구 도보 10분</div>

          {/* 신도림동(구로역) */}
          <div style={{ fontWeight: 900, fontSize: "12px", marginBottom: "6px", color: "#333" }}>신도림동(구로역)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "11px", marginBottom: "20px" }}>
            <div><span style={{ color: "#3a6ccd", fontWeight: 900 }}>간선(파랑)</span>{"  "}160, 503, 600, 662, 660, N16(심야)</div>
            <div><span style={{ color: "#3a9e3a", fontWeight: 900 }}>지선(초록)</span>{"  "}6515, 6516, 6637, 6640A, 6640B(신도림역 방면), 6713, 6411, 6511</div>
            <div><span style={{ color: "#d63a3a", fontWeight: 900 }}>직행(빨강)</span>{"  "}301, 320, 5200</div>
            <div><span style={{ color: "#888", fontWeight: 900 }}>경기일반</span>{"  "}10, 11-1, 11-2, 83, 88, 530</div>
          </div>

          {/* 신도림중학교 */}
          <div style={{ fontWeight: 900, fontSize: "12px", marginBottom: "6px", color: "#333" }}>신도림중학교</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "11px" }}>
            <div><span style={{ color: "#3a9e3a", fontWeight: 900 }}>지선(초록)</span>{"  "}5615, 5714, 6512, 6411, 6511</div>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}

/* =========================
   📅 SAVE THE DATE
========================= */
function SaveTheDate() {
  const calendar = [
    [null, null, null, 1, 2, 3, 4],
    [5, 6, 7, 8, 9, 10, 11],
    [12, 13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24, 25],
    [26, 27, 28, 29, 30, 31, null],
  ];

  return (
    <section
      style={{
        position: "relative",
        marginTop: "24px",
        marginLeft: "-24px",
        width: "calc(100% + 48px)",
      }}
    >
      <img
        src="/save_the_date.png"
        style={{
          width: "100%",
          display: "block",
          margin: 0,
          padding: 0,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: "10%",
          transform: "scale(0.8) translateY(5%)", // ✅ FIX: translateY로 캘린더 위치 조정
        }}
      >
        <div
          style={{
            fontSize: "34px",
            fontWeight: 900,
            marginBottom: "24px",
            marginTop: "10px",
            color: "#222",
            fontFamily: "'Cormorant Garamond', serif",
            letterSpacing: "1px",
          }}
        >
          October 2026
        </div>

        <div
          style={{
            width: "78%",
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "6px",
          }}
        >
          {calendar.flat().map((day, i) => (
            <div
              key={i}
              style={{
                aspectRatio: "1 / 1",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "999px",
                background: day === 4 ? "#BCCEDD" : "transparent",
                color:
                  day === 4
                    ? "#fff"
                    : day
                    ? new Date(2026, 9, day).getDay() === 0
                      ? "#FF1111" // 일요일
                      : new Date(2026, 9, day).getDay() === 6
                      ? "#1144FF" // 토요일
                      : "#222"
                    : "#222",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================
   APP
========================= */
function App() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(true);
  // ✅ FIX: 카카오 인앱브라우저 vh 튐 방지 - 최초 렌더 시점 높이로 px 고정
  const [heroHeight] = useState(() => window.innerHeight * 1.15);

  const audioRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 2000);
    const t2 = setTimeout(async () => {
      setLoading(false);
      setTimeout(async () => {
        try {
          await audioRef.current?.play();
          setMusicPlaying(true);
        } catch (e) {
          // 사파리 자동재생 실패 시 첫 터치/클릭에서 재생
          setMusicPlaying(false);
          const tryPlay = async () => {
            try {
              await audioRef.current?.play();
              setMusicPlaying(true);
            } catch (_) {}
            document.removeEventListener("touchstart", tryPlay);
            document.removeEventListener("click", tryPlay);
          };
          document.addEventListener("touchstart", tryPlay, { once: true });
          document.addEventListener("click", tryPlay, { once: true });
        }
      }, 300);
    }, 2600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const toggleMusic = async () => {
    if (!audioRef.current) return;
    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setMusicPlaying(true);
      } catch (e) {
        console.log(e);
      }
    }
  };

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#fff8fb",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: fadeOut ? 0 : 1,
          transition: "opacity 0.6s ease",
          zIndex: 9999,
        }}
      >
        <img
          src="/intro_image.png"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    );
  }

  return (
    <>
      <style>{floatingStyle}</style>

      {/* 🎵 AUDIO */}
      <audio ref={audioRef} src="/wedding_bgm.mp3" loop />

      {/* 🎵 BUTTON */}
      <button
        onClick={toggleMusic}
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          width: "58px",
          height: "58px",
          borderRadius: "999px",
          border: "none",
          background: "#D66072",
          color: "#fff",
          fontSize: "22px",
          zIndex: 999999,
          cursor: "pointer",
          boxShadow: "0 4px 18px rgba(0,0,0,0.15)",
        }}
      >
        {musicPlaying ? "❚❚" : "▶"}
      </button>

      {/* 🌹 BG */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage: "url('/rose_back_image.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
          opacity: 0.22,
        }}
      />

      <div
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          background: "#fff8fb",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        {/* 🌄 HERO - ✅ FIX: dvh 사용으로 모바일 주소창 튐 방지 */}
        <section
          style={{
            height: `${heroHeight}px`,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src="/main-image-no-text.png"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />

          <img
            src="/date-sticker.png"
            style={{
              position: "absolute",
              left: "50%",
              bottom: "40px",
              transform: "translateX(-50%)",
              width: "85%",
              maxWidth: "360px",
              animation: "float 4s ease-in-out infinite",
            }}
          />
        </section>

        {/* 💌 INTRO */}
        <section
          style={{
            minHeight: "120vh",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "145px 24px 70px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url('/pink_bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.4,
            }}
          />

          <div
            style={{
              zIndex: 2,
              marginTop: "-110px",
              marginBottom: "20px",
              fontSize: "95px",
              fontFamily: "'Kapakana', cursive",
              fontWeight: 400,
              letterSpacing: "-3px",
            }}
          >
            Love ya-!
          </div>

          <img
            src="/profile_image.png"
            style={{
              width: "250px",
              marginBottom: "40px",
              zIndex: 2,
              animation: "profileSwing 4s ease-in-out infinite",
            }}
          />

          <div
            style={{
              zIndex: 2,
              fontFamily: "'Orbit', sans-serif",
              fontWeight: 900,
              lineHeight: 2,
              whiteSpace: "pre-line",
              fontSize: "13px",
            }}
          >
{`웃고, 장난치고, 사랑하다 보니
이제는 평생을 함께하기로 했습니다.

우리의 시작하는 날,
함께해주시면 큰 기쁨으로 간직하겠습니다.

김보성 · 정서영 드림`}
          </div>
        </section>

        {/* 📸 CAROUSEL */}
        <FadeInSection padding="30px 0">
          <SwipeGallery />
        </FadeInSection>

        {/* 🖼️ GRID */}
        <FadeInSection padding="30px 0">
          <GridGallery />
        </FadeInSection>

        {/* 📅 SAVE THE DATE */}
        <SaveTheDate />

        {/* 📆 DATE INFO */}
        <DateInfo />

        {/* 📍 LOCATION INFO */}
        <LocationInfo />

        {/* ⏳ COUNTDOWN */}
        <Countdown />

        {/* 💝 ACCOUNT INFO */}
        <AccountInfo />

        {/* 💌 GUEST MESSAGE */}
        <GuestMessage />

        {/* 📤 SHARE */}
        <ShareButtons />
      </div>
    </>
  );
}

/* =========================
   ⏳ COUNTDOWN
========================= */
function Countdown() {
  const weddingDate = new Date("2026-10-04T15:00:00");

  const calcDiff = () => {
    const now = new Date();
    const diff = Math.ceil((weddingDate - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const [days, setDays] = useState(calcDiff);

  useEffect(() => {
    const timer = setInterval(() => setDays(calcDiff()), 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  return (
    <FadeInSection padding="40px 0">
      <div style={{
        textAlign: "center",
        padding: "40px 24px",
        fontFamily: "'Orbit', sans-serif",
        background: "linear-gradient(135deg, #fff0f4 0%, #fff8fb 100%)",
        margin: "0 0",
      }}>
        <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#aaa", marginBottom: "24px" }}>
          COMING SOON
        </div>
        <div style={{ fontSize: "13px", color: "#888", marginBottom: "12px" }}>
          김보성 ❤️ 정서영의 결혼식이
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
          <span style={{ fontSize: "36px", color: "#D66072", fontWeight: 900, lineHeight: 1 }}>D −</span>
          <span style={{ fontSize: "36px", fontWeight: 900, color: "#D66072", lineHeight: 1 }}>{days}</span>
          <span style={{ fontSize: "36px", color: "#D66072", fontWeight: 900, lineHeight: 1 }}>일</span>
        </div>
        <div style={{ fontSize: "13px", color: "#888" }}>
          남았습니다
        </div>
        <div style={{ marginTop: "24px", fontSize: "11px", color: "#bbb", letterSpacing: "2px" }}>
          2026 · 10 · 04 · SUNDAY · 3:00 PM
        </div>
      </div>
    </FadeInSection>
  );
}

/* =========================
   💝 ACCOUNT INFO
========================= */
function AccountInfo() {
  const copy = (text) => {
    const fallback = () => {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.top = "0";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.focus();
      el.select();
      try { document.execCommand("copy"); alert("복사되었습니다!"); }
      catch { alert("복사 실패. 직접 복사해주세요:\n" + text); }
      document.body.removeChild(el);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => alert("복사되었습니다!")).catch(fallback);
    } else {
      fallback();
    }
  };

  return (
    <FadeInSection padding="0 0 60px">
      <div style={{
        padding: "40px 24px",
        fontFamily: "'Orbit', sans-serif",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#aaa", marginBottom: "32px" }}>
          마음 전하실 곳
        </div>

        {/* 신랑측 */}
        <div style={{
          background: "#fff",
          border: "1px solid #f0e0e5",
          borderRadius: "16px",
          padding: "24px 20px",
          marginBottom: "16px",
        }}>
          <div style={{ fontSize: "11px", color: "#D66072", letterSpacing: "2px", marginBottom: "12px" }}>
            ✿ 신랑측
          </div>
          <div style={{ fontSize: "14px", fontWeight: 900, color: "#222", marginBottom: "8px" }}>
            신랑 김보성
          </div>
          <div style={{ fontSize: "12px", color: "#888", marginBottom: "16px" }}>
            은행명 미정 · 000-0000-0000
          </div>
          <button
            onClick={() => copy("000-0000-0000")}
            style={{
              background: "transparent",
              border: "1.5px solid #D66072",
              color: "#D66072",
              borderRadius: "999px",
              padding: "7px 18px",
              fontSize: "11px",
              fontFamily: "'Orbit', sans-serif",
              letterSpacing: "1px",
              cursor: "pointer",
            }}
          >
            계좌 복사
          </button>
        </div>

        {/* 신부측 */}
        <div style={{
          background: "#fff",
          border: "1px solid #f0e0e5",
          borderRadius: "16px",
          padding: "24px 20px",
        }}>
          <div style={{ fontSize: "11px", color: "#D66072", letterSpacing: "2px", marginBottom: "12px" }}>
            ✿ 신부측
          </div>
          <div style={{ fontSize: "14px", fontWeight: 900, color: "#222", marginBottom: "8px" }}>
            신부 정서영
          </div>
          <div style={{ fontSize: "12px", color: "#888", marginBottom: "16px" }}>
            우리은행 · 1002-456-946143
          </div>
          <button
            onClick={() => copy("1002-456-946143")}
            style={{
              background: "transparent",
              border: "1.5px solid #D66072",
              color: "#D66072",
              borderRadius: "999px",
              padding: "7px 18px",
              fontSize: "11px",
              fontFamily: "'Orbit', sans-serif",
              letterSpacing: "1px",
              cursor: "pointer",
            }}
          >
            계좌 복사
          </button>
        </div>
      </div>
    </FadeInSection>
  );
}

/* =========================
   📤 SHARE BUTTONS
========================= */
function ShareButtons() {
  const shareUrl = window.location.href;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).catch(() => {
      const el = document.createElement("textarea");
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }).finally(() => alert("청첩장 주소가 복사되었습니다!"));
  };

  const kakaoShare = () => {
    if (window.Kakao && window.Kakao.isInitialized()) {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "김보성 ❤️ 정서영 결혼합니다",
          description: "2026 · 10 · 04 · SUNDAY · 3:00 PM\n더 링크 호텔 5F 가든홀",
          imageUrl: window.location.origin + "/main-image-no-text.png",
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
        buttons: [{ title: "청첩장 보기", link: { mobileWebUrl: shareUrl, webUrl: shareUrl } }],
      });
    } else {
      alert("카카오톡 공유는 카카오 SDK 설정이 필요합니다.\n\n index.html에 카카오 SDK를 추가해주세요!");
    }
  };

  return (
    <FadeInSection padding="0 0 80px">
      <div style={{
        padding: "0 24px",
        fontFamily: "'Orbit', sans-serif",
        textAlign: "center",
      }}>
        <div style={{ width: "40px", height: "1px", background: "#eee", margin: "0 auto 32px" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
          {/* 카카오톡 공유 */}
          <button
            onClick={kakaoShare}
            style={{
              width: "220px",
              padding: "14px 20px",
              borderRadius: "14px",
              border: "none",
              background: "#FEE500",
              color: "#3C1E1E",
              fontSize: "13px",
              fontWeight: 900,
              fontFamily: "'Orbit', sans-serif",
              letterSpacing: "1px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#3C1E1E">
              <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.632 1.556 4.95 3.938 6.312L4.5 21l4.438-2.344C9.888 18.878 10.933 19 12 19c5.523 0 10-3.477 10-7.5S17.523 3 12 3z"/>
            </svg>
            카카오톡 공유
          </button>

          {/* 결혼 소문내기 */}
          <button
            onClick={copyLink}
            style={{
              width: "220px",
              padding: "14px 20px",
              borderRadius: "14px",
              border: "1.5px solid #D66072",
              background: "transparent",
              color: "#D66072",
              fontSize: "13px",
              fontWeight: 900,
              fontFamily: "'Orbit', sans-serif",
              letterSpacing: "1px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D66072" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            결혼 소문내기
          </button>
        </div>

        {/* 배포 안내 */}
        <div style={{ marginTop: "32px", fontSize: "10px", color: "#ccc", lineHeight: 1.8, letterSpacing: "0.3px" }}>
        </div>
      </div>
    </FadeInSection>
  );
}

/* =========================
   💌 GUEST MESSAGE
========================= */
function GuestMessage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith("msg:"));
  
      const loaded = keys.map(k => {
        return JSON.parse(localStorage.getItem(k));
      });
  
      setMessages(
        loaded.filter(Boolean).sort((a, b) => b.ts - a.ts)
      );
    } catch (e) {
      setMessages([]);
    }
  
    setLoading(false);
  };

  const submit = async () => {
    if (!name.trim() || !message.trim()) {
      alert("이름과 메시지를 모두 입력해주세요!");
      return;
    }

    setSubmitting(true);

    const entry = {
      id: Date.now(),
      name: name.trim(),
      message: message.trim(),
      ts: Date.now(),
    };

    try {
      localStorage.setItem(
        "msg:" + entry.id,
        JSON.stringify(entry)
      );

      setName("");
      setMessage("");
      await loadMessages();
    } catch (e) {
      alert("저장 실패");
    }

    setSubmitting(false);
  };

  return (
    <FadeInSection padding="0 0 60px">
      <div style={{ padding: "40px 24px", fontFamily: "'Orbit', sans-serif" }}>
        
        <div style={{
          textAlign: "center",
          fontSize: "11px",
          letterSpacing: "4px",
          color: "#aaa",
          marginBottom: "28px"
        }}>
          축하 메시지
        </div>

        {/* 입력 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
          
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름"
            style={{
              padding: "12px",
              border: "1px solid #f0e0e5",
              borderRadius: "10px",
            }}
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="축하 메시지를 남겨주세요 💌"
            rows={4}
            style={{
              padding: "12px",
              border: "1px solid #f0e0e5",
              borderRadius: "10px",
              resize: "none",
            }}
          />

          <button
            onClick={submit}
            disabled={submitting}
            style={{
              background: "#D66072",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "12px",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            {submitting ? "전송 중..." : "메시지 남기기 💌"}
          </button>
        </div>

        {/* 포스트잇 메시지 */}
        {loading ? (
          <div style={{ textAlign: "center", color: "#ccc" }}>불러오는 중...</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "#ccc" }}>
            첫 번째 메시지를 남겨주세요 💕
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {messages.map((m, i) => (
              <div
                key={m.id}
                style={{
                  background: "#FFFDF5",
                  border: "1px solid #f2e1e6",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  transform: `rotate(${(i % 3 - 1) * 2}deg)`,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 900, color: "#D66072", marginBottom: "6px" }}>
                  {m.name}
                </div>

                <div style={{ fontSize: "12px", color: "#444", whiteSpace: "pre-wrap" }}>
                  {m.message}
                </div>
                <button
                  onClick={async () => {
                    localStorage.removeItem("msg:" + m.id);
                    await loadMessages();
                  }}
                  style={{
                    marginTop: "8px",
                    fontSize: "10px",
                    border: "none",
                    background: "transparent",
                    color: "#D66072",
                    cursor: "pointer",
                  }}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </FadeInSection>
  );
}

export default App;