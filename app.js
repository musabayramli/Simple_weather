const weatherApiKey = "02db82e5aec7ed94f4b24dc5338a58bd";
const audio = document.getElementById("nature-sound");
const soundToggleBtn = document.getElementById("sound-toggle");
let isAudioPlaying = false;
let isFirstPlay = true;

// Axtarış düyməsinə klik olunduqda hava məlumatlarını gətirir
document.getElementById("search-btn").addEventListener("click", function () {
  const city = document.getElementById("city-input").value.trim();

  // Səs yalnız birinci dəfə oynadılır və ya ilk dəfə səs düyməsinə basılacaq
  if (isFirstPlay) {
    audio.currentTime = 4;
    audio
      .play()
      .then(() => {
        isAudioPlaying = true;
        audio.muted = false;
        soundToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        isFirstPlay = false;
      })
      .catch((error) => {
        console.error("Səs oynatma xətası:", error);
      });
  }

  // Hava məlumatını almaq üçün sorğu
  if (city) {
    getWeather(city);
    document.getElementById("city-input").value = "";
  } else {
    alert("Zəhmət olmasa, şəhər adı daxil edin.");
  }
});

// Enter düyməsi ilə sorğu göndərmə
document
  .getElementById("city-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("search-btn").click();
    }
  });

function getWeather(city) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric&lang=az`;

  fetch(weatherUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Hava məlumatı tapılmadı: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Alınan məlumat:", data);

      const cityName = data.name;
      const weatherDescription = data.weather[0].description;
      const temperature = data.main.temp;
      const feelsLike = data.main.feels_like;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;

      // Hava proqnozu məlumatlarını HTML elementlərinə yazırıq
      document.getElementById("city-name").textContent = `Şəhər: ${cityName}`;
      document.getElementById(
        "weather-description"
      ).textContent = `Hava: ${weatherDescription}`;
      document
        .getElementById("temperature")
        .querySelector("span").textContent = `${temperature}°C`;
      document
        .getElementById("feels-like")
        .querySelector("span").textContent = `${feelsLike}°C`;
      document
        .getElementById("humidity")
        .querySelector("span").textContent = `${humidity}%`;
      document
        .getElementById("wind-speed")
        .querySelector("span").textContent = `${windSpeed} m/s`;

      // weather-container-i göstəririk
      document.getElementById("weather-container").classList.remove("hidden");
      document.getElementById("weather-container").classList.add("show");
    })
    .catch((error) => {
      console.error("Sorğu zamanı səhv baş verdi:", error);
      alert(`Hava məlumatı tapılmadı. Səhv: ${error.message}`);
    });
}

// Səs düyməsi ilə səsi idarə edirik
soundToggleBtn.addEventListener("click", function () {
  // İlk dəfə səs düyməsinə klik edildikdə səs oynayacaq
  if (isFirstPlay) {
    audio.currentTime = 4;
    audio
      .play()
      .then(() => {
        isAudioPlaying = true;
        audio.muted = false;
        soundToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        isFirstPlay = false;
      })
      .catch((error) => {
        console.error("Səs oynatma xətası:", error);
      });
  } else {
    // Əgər səs artıq oynayırsa, səsi səssizləşdir və ya səsi aç
    if (audio.muted) {
      audio.muted = false;
      soundToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
      audio.muted = true;
      soundToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
  }
});
