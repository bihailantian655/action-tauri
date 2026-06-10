import { shell } from '@tauri-apps/api';

document.addEventListener('DOMContentLoaded', () => {
  const openExplorerBtn = document.getElementById('openExplorerBtn');
  const openWeatherBtn = document.getElementById('openWeatherBtn');
  const weatherContainer = document.getElementById('weatherContainer');
  const weatherContent = document.getElementById('weatherContent');

  openExplorerBtn.addEventListener('click', async () => {
    try {
      await shell.open('explorer.exe');
    } catch (error) {
      console.error('Failed to open explorer:', error);
    }
  });

  openWeatherBtn.addEventListener('click', async () => {
    weatherContainer.classList.remove('hidden');
    weatherContent.innerHTML = '加载中...';
    
    try {
      const currentTime = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      
      const weatherData = await fetchWeather();
      
      weatherContent.innerHTML = `
        <div class="weather-info">
          <div class="weather-row">
            <span>当前时间</span>
            <span>${currentTime}</span>
          </div>
          <div class="weather-row">
            <span>城市</span>
            <span>${weatherData.city}</span>
          </div>
          <div class="weather-row">
            <span>天气</span>
            <span>${weatherData.weather}</span>
          </div>
          <div class="weather-row">
            <span>温度</span>
            <span>${weatherData.temperature}°C</span>
          </div>
          <div class="weather-row">
            <span>湿度</span>
            <span>${weatherData.humidity}%</span>
          </div>
          <div class="weather-row">
            <span>风速</span>
            <span>${weatherData.windSpeed} km/h</span>
          </div>
        </div>
      `;
    } catch (error) {
      weatherContent.innerHTML = `
        <div class="weather-info">
          <div class="weather-row">
            <span>当前时间</span>
            <span>${new Date().toLocaleString('zh-CN')}</span>
          </div>
          <div class="weather-row">
            <span>天气</span>
            <span>获取失败，请检查网络</span>
          </div>
        </div>
      `;
    }
  });
});

async function fetchWeather() {
  const response = await fetch('https://wttr.in/beijing?format=j1');
  const data = await response.json();
  
  const currentCondition = data.current_condition[0];
  
  return {
    city: data.nearest_area[0].areaName[0].value,
    weather: currentCondition.weatherDesc[0].value,
    temperature: currentCondition.temp_C,
    humidity: currentCondition.humidity,
    windSpeed: currentCondition.windspeedKmph
  };
}