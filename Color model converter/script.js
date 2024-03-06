const form = document.getElementById('form');
const result = document.getElementById('result');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const image = document.getElementById('image').files[0];
  const fromModel = document.getElementById('from-model').value;
  const toModel = document.getElementById('to-model').value;

  const reader = new FileReader();

  reader.onload = () => {
    const imageData = reader.result;
    const imageElement = new Image();

    imageElement.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = imageElement.width;
      canvas.height = imageElement.height;

      ctx.drawImage(imageElement, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      let convertedImageData;

      switch (fromModel) {
        case 'rgb':
          switch (toModel) {
            case 'cmyk':
              convertedImageData = rgbToCmyk(imageData);
              break;
            case 'hsl':
              convertedImageData = rgbToHsl(imageData);
              break;
            case 'lab':
              convertedImageData = rgbToLab(imageData);
              break;
            case 'hsv':
              convertedImageData = rgbToHsv(imageData);
              break;
            case 'ycbcr':
              convertedImageData = rgbToYcbcr(imageData);
              break;
          }
          break;
        case 'cmyk':
          switch (toModel) {
            case 'rgb':
              convertedImageData = cmykToRgb(imageData);
              break;
            case 'hsl':
              convertedImageData = cmykToHsl(imageData);
              break;
            case 'lab':
              convertedImageData = cmykToLab(imageData);
              break;
            case 'hsv':
              convertedImageData = cmykToHsv(imageData);
              break;
            case 'ycbcr':
              convertedImageData = cmykToYcbcr(imageData);
              break;
          }
          break;
        case 'hsl':
          switch (toModel) {
            case 'rgb':
              convertedImageData = hslToRgb(imageData);
              break;
            case 'cmyk':
              convertedImageData = hslToCmyk(imageData);
              break;
            case 'lab':
              convertedImageData = hslToLab(imageData);
              break;
            case 'hsv':
              convertedImageData = hslToHsv(imageData);
              break;
            case 'ycbcr':
              convertedImageData = hslToYcbcr(imageData);
              break;
          }
          break;
        case 'lab':
          switch (toModel) {
            case 'rgb':
              convertedImageData = labToRgb(imageData);
              break;
            case 'cmyk':
              convertedImageData = labToCmyk(imageData);
              break;
            case 'hsl':
              convertedImageData = labToHsl(imageData);
              break;
            case 'hsv':
              convertedImageData = labToHsv(imageData);
              break;
            case 'ycbcr':
              convertedImageData = labToYcbcr(imageData);
              break;
          }
          break;
        case 'hsv':
          switch (toModel) {
            case 'rgb':
              convertedImageData = hsvToRgb(imageData);
              break;
            case 'cmyk':
              convertedImageData = hsvToCmyk(imageData);
              break;
            case 'hsl':
              convertedImageData = hsvToHsl(imageData);
              break;
            case 'lab':
              convertedImageData = hsvToLab(imageData);
              break;
            case 'ycbcr':
              convertedImageData = hsvToYcbcr(imageData);
              break;
          }
          break;
        case 'ycbcr':
          switch (toModel) {
            case 'rgb':
              convertedImageData = ycbcrToRgb(imageData);
              break;
            case 'cmyk':
              convertedImageData = ycbcrToCmyk(imageData);
              break;
            case 'hsl':
              convertedImageData = ycbcrToHsl(imageData);
              break;
            case 'lab':
              convertedImageData = ycbcrToLab(imageData);
              break;
            case 'hsv':
              convertedImageData = ycbcrToHsv(imageData);
              break;
          }
          break;
      }

      ctx.putImageData(convertedImageData, 0, 0);

      result.innerHTML = `
        <div>
          <h3>До конвертации</h3>
          <img src="${imageElement.src}" alt="Исходное изображение">
        </div>
        <div>
          <h3>После конвертации</h3>
          <img src="${canvas.toDataURL()}" alt="Конвертированное изображение">
        </div>
      `;

      // Вывод информации об изображении
      const imageInfo = `
        <ul>
          <li>Размер: ${image.size} байт</li>
          <li>Разрешение: ${imageElement.width}x${imageElement.height} пикселей</li>
          <li>Глубина цвета: ${imageElement.bitDepth} бит</li>
          <li>Формат файла: ${image.type}</li>
          <li>Цветовая модель: ${fromModel} -> ${toModel}</li>
        </ul>
      `;

      result.innerHTML += imageInfo;
    };

    imageElement.src = imageData;
  };

  reader.readAsDataURL(image);
});
// Функции для перевода цветов

function rgbToCmyk(imageData) {
  const data = imageData.data;
  const newImageData = new ImageData(imageData.width, imageData.height);
  const newData = newImageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;

    const k = 1 - Math.max(r, g, b);
    const c = (1 - r - k) / (1 - k);
    const m = (1 - g - k) / (1 - k);
    const y = (1 - b - k) / (1 - k);

    newData[i] = c * 255;
    newData[i + 1] = m * 255;
    newData[i + 2] = y * 255;
    newData[i + 3] = k * 255;
  }

  return newImageData;
}

function cmykToRgb(imageData) {
  const data = imageData.data;
  const newImageData = new ImageData(imageData.width, imageData.height);
  const newData = newImageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const c = data[i] / 255;
    const m = data[i + 1] / 255;
    const y = data[i + 2] / 255;
    const k = data[i + 3] / 255;

    const r = (1 - c) * (1 - k);
    const g = (1 - m) * (1 - k);
    const b = (1 - y) * (1 - k);

    newData[i] = r * 255;
    newData[i + 1] = g * 255;
    newData[i + 2] = b * 255;
    newData[i + 3] = 255;
  }

  return newImageData;
}
function rgbToHsl(imageData) {
  const data = imageData.data;
  const newImageData = new ImageData(imageData.width, imageData.height);
  const newData = newImageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h, s, l;

    if (delta === 0) {
      h = 0;
    } else if (max === r) {
      h = (g - b) / delta % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }

    h = h * 60;
    if (h < 0) {
      h += 360;
    }

    l = (max + min) / 2;

    if (delta === 0) {
      s = 0;
    } else {
      s = delta / (1 - Math.abs(2 * l - 1));
    }

    newData[i] = h;
    newData[i + 1] = s * 100;
    newData[i + 2] = l * 100;
    newData[i + 3] = 255;
  }

  return newImageData;
}

function hslToRgb(imageData) {
  const data = imageData.data;
  const newImageData = new ImageData(imageData.width, imageData.height);
  const newData = newImageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const h = data[i] / 360;
    const s = data[i + 1] / 100;
    const l = data[i + 2] / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hueToRgb(p, q, h + 1 / 3);
      g = hueToRgb(p, q, h);
      b = hueToRgb(p, q, h - 1 / 3);
    }

    newData[i] = r * 255;
    newData[i + 1] = g * 255;
    newData[i + 2] = b * 255;
    newData[i + 3] = 255;
  }

  return newImageData;
}
function rgbToLab(imageData) {
  const data = imageData.data;
  const newImageData = new ImageData(imageData.width, imageData.height);
  const newData = newImageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;

    // Convert RGB to XYZ
    const X = 0.4124 * r + 0.3576 * g + 0.1805 * b;
    const Y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const Z = 0.0193 * r + 0.1192 * g + 0.9505 * b;

    // Convert XYZ to Lab
    const L = 116 * f(Y / 0.9505) - 16;
    const a = 500 * (f(X / 0.9807) - f(Y / 0.9505));
    const b1 = 200 * (f(Y / 0.9505) - f(Z / 1.0888));

    // Convert Lab to newData
    newData[i] = L;
    newData[i + 1] = a;
    newData[i + 2] = b1;
    newData[i + 3] = data[i + 3];
  }

  return newImageData;
}

function f(x) {
  return x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
}
function labToRgb(imageData) {
  const data = imageData.data;
  const newImageData = new ImageData(imageData.width, imageData.height);
  const newData = newImageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const l = data[i] / 100;
    const a = data[i + 1];
    const b = data[i + 2];

    let x, y, z;

    if (l <= 8) {
      x = l / 903.3;
      y = (l / 116 - 16 / 116) / 500;
      z = (l / 116 - 20 / 116) / 200;
    } else {
      x = Math.pow((l + 16) / 116, 3);
      y = (a / 500) ** 3;
      z = (b / 200) ** 3;
    }

    x = 95.047 * x - 100.000;
    y = 100.000 * y;
    z = 108.883 * z - 100.000;

    const r = x * 3.2406 + y * -1.5372 + z * -0.4986;
    const g = x * -0.9689 + y * 1.8758 + z * 0.0415;
    const b1 = x * 0.0557 + y * -0.2040 + z * 1.0570;

    newData[i] = r * 255;
    newData[i + 1] = g * 255;
    newData[i + 2] = b1 * 255;
    newData[i + 3] = 255;
  }

  return newImageData;
}

function rgbToHsv(imageData) {
  const data = imageData.data;
  const newImageData = new ImageData(imageData.width, imageData.height);
  const newData = newImageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  const v = max;
  const s = (max - min) / max;
  
  let h;
  if (max === min) {
    h = 0;
  } else if (max === r) {
    h = 60 * (0 + (g - b) / (max - min));
  } else if (max === g) {
    h = 60 * (2 + (b - r) / (max - min));
  } else if (max === b) {
    h = 60 * (4 + (r - g) / (max - min));
  }
  
  if (h < 0) {
    h += 360;
  }
  
  newData[i] = h;
  newData[i + 1] = s * 100;
  newData[i + 2] = v;
  newData[i + 3] = data[i + 3];
  }
  
  return newImageData;
  }
  
  function hsvToRgb(imageData) {
  const data = imageData.data;
  const newImageData = new ImageData(imageData.width, imageData.height);
  const newData = newImageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
  const h = data[i];
  const s = data[i + 1] / 100;
  const v = data[i + 2];
  
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  
  let r, g, b;
  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  
  newData[i] = (r + m) * 255;
  newData[i + 1] = (g + m) * 255;
  newData[i + 2] = (b + m) * 255;
  newData[i + 3] = data[i + 3];
  }
  
  return newImageData;
  }
  
  function rgbToYcbcr(imageData) {
  const data = imageData.data;
  const newImageData = new ImageData(imageData.width, imageData.height);
  const newData = newImageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const cb = -0.168736 * r - 0.331264 * g + 0.5 * b + 128;
  const cr = 0.5 * r - 0.418688 * g - 0.081312 * b + 128;
  
  newData[i] = y;
  newData[i + 1] = cb;
  newData[i + 2] = cr;
  newData[i + 3] = data[i + 3];
  }
  
  return newImageData;
  }
  
  function ycbcrToRgb(imageData) {
  const data = imageData.data;
  const newImageData = new ImageData(imageData.width, imageData.height);
  const newData = newImageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
  const y = data[i];
  const cb = data[i + 1];
  const cr = data[i + 2];
  
  const r = y + 1.402 * (cr - 128);
  const g = y - 0.344136 * (cb - 128) - 0.714136 * (cr - 128);
  const b = y + 1.772 * (cb - 128);
  
  newData[i] = r;
  newData[i + 1] = g;
  newData[i + 2] = b;
  newData[i + 3] = data[i + 3];
  }
  
  return newImageData;
  }
  function cmykToHsl(imageData) {
    const data = imageData.data;
    const newImageData = new ImageData(imageData.width, imageData.height);
    const newData = newImageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
    const c = data[i] / 255;
    const m = data[i + 1] / 255;
    const y = data[i + 2] / 255;
    const k = data[i + 3] / 255;
    
    const l = (2 - k) * (0.5 + (k / 2)) / 2;
    
    let s;
    if (l === 0 || l === 1) {
      s = 0;
    } else {
      s = (2 * (1 - l)) / (2 - k) / 2;
    }
    
    let h;
    if (c === m && c === y) {
      h = 0;
    } else if (c >= m && c >= y) {
      h = 60 * (((m - y) / (c - Math.min(m, y))) % 6);
    } else if (m >= c && m >= y) {
      h = 60 * (((y - c) / (m - Math.min(c, y))) + 2);
    } else if (y >= c && y >= m) {
      h = 60 * (((c - m) / (y - Math.min(c, m))) + 4);
    }
    
    newData[i] = h;
    newData[i + 1] = s * 100;
    newData[i + 2] = l * 100;
    newData[i + 3] = data[i + 3];
    }
    
    return newImageData;
    }
    
    function hslToCmyk(imageData) {
    const data = imageData.data;
    const newImageData = new ImageData(imageData.width, imageData.height);
    const newData = newImageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
    const h = data[i];
    const s = data[i + 1] / 100;
    const l = data[i + 2] / 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - 0.5 * c;
    
    let r, g, b;
    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (h >= 300 && h < 360) {
      r = c;
      g = 0;
      b = x;
    }
    
    const k = 1 - Math.max(r, g, b);
    
    newData[i] = r * 255;
    newData[i + 1] = g * 255;
    newData[i + 2] = b * 255;
    newData[i + 3] = k * 255;
    }
    
    return newImageData;
    }
    
    function cmykToLab(imageData) {
    const data = imageData.data;
    const newImageData = new ImageData(imageData.width, imageData.height);
    const newData = newImageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
    const c = data[i] / 255;
    const m = data[i + 1] / 255;
    const y = data[i + 2] / 255;
    const k = data[i + 3] / 255;
    
    const l = (2 - k) * (0.5 + (k / 2)) / 2 * 100;
    const a = (c - m) * (1 - k) * 100;
    const b = (y - m) * (1 - k) * 100;
    
    newData[i] = l;
    newData[i + 1] = a;
    newData[i + 2] = b;
    newData[i + 3] = data[i + 3];
    }
    
    return newImageData;
    }

    function labToCmyk(imageData) {
      const data = imageData.data;
      const newImageData = new ImageData(imageData.width, imageData.height);
      const newData = newImageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const l = data[i];
        const a = data[i + 1];
        const b = data[i + 2];
      
        const c = (1 - (l / 100)) * 100;
        const m = (1 - (a / 100) - c) * 100;
        const y = (1 - (b / 100) - c) * 100;
        const k = c;
      
        newData[i] = c;
        newData[i + 1] = m;
        newData[i + 2] = y;
        newData[i + 3] = k;
      }
      
      return newImageData;
      }
      function cmykToHsv(imageData) {
        const data = imageData.data;
        const newImageData = new ImageData(imageData.width, imageData.height);
        const newData = newImageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const c = data[i] / 255;
        const m = data[i + 1] / 255;
        const y = data[i + 2] / 255;
        const k = data[i + 3] / 255;
      
        // Convert CMYK to RGB
        const r = 255 * (1 - c) * (1 - k);
        const g = 255 * (1 - m) * (1 - k);
        const b = 255 * (1 - y) * (1 - k);
      
        // Convert RGB to HSV
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const chroma = max - min;
        const hue = chroma === 0 ? 0 : Math.acos((r - g + r - b) / (2 * chroma)) / (2 * Math.PI);
        const saturation = chroma === 0 ? 0 : chroma / max;
        const value = max / 255;
      
        // Store HSV values in the new image data
        newData[i] = hue * 360;
        newData[i + 1] = saturation * 100;
        newData[i + 2] = value * 100;
        newData[i + 3] = data[i + 3];
      }
      
      return newImageData;
    }
    function HsvToCmyk(imageData) {
      const data = imageData.data;
      const newImageData = new ImageData(imageData.width, imageData.height);
      const newData = newImageData.data;
    
      for (let i = 0; i < data.length; i += 4) {
        const h = data[i] / 360;
        const s = data[i + 1] / 100;
        const v = data[i + 2] / 100;
    
        // Convert HSV to RGB
        const c = v * s;
        const x = c * (1 - Math.abs((h * 6) % 2 - 1));
        const m = c * (1 - Math.abs((h * 6 + 2) % 2 - 1));
        const y = c * (1 - Math.abs((h * 6 + 4) % 2 - 1));
    
        // Convert RGB to CMYK
        const k = 1 - v;
        const cmyk = [c, m, y, k];
    
        // Store CMYK values in the new image data
        newData[i] = cmyk[0] * 255;
        newData[i + 1] = cmyk[1] * 255;
        newData[i + 2] = cmyk[2] * 255;
        newData[i + 3] = cmyk[3] * 255;
      }
    
      return newImageData;
    }

    function SmykToYcbcr(imageData) {
      const data = imageData.data;
      const newImageData = new ImageData(imageData.width, imageData.height);
      const newData = newImageData.data;
    
      for (let i = 0; i < data.length; i += 4) {
        const c = data[i] / 255;
        const m = data[i + 1] / 255;
        const y = data[i + 2] / 255;
        const k = data[i + 3] / 255;
    
        // Convert CMYK to RGB
        const r = 255 * (1 - c) * (1 - k);
        const g = 255 * (1 - m) * (1 - k);
        const b = 255 * (1 - y) * (1 - k);
    
        // Convert RGB to YCbCr
        const yCbCr = [
          0.299 * r + 0.587 * g + 0.114 * b,
          -0.168736 * r - 0.331264 * g + 0.5 * b + 128,
          0.5 * r - 0.418688 * g - 0.081312 * b + 128,
        ];
    
        // Store YCbCr values in the new image data
        newData[i] = yCbCr[0];
        newData[i + 1] = yCbCr[1];
        newData[i + 2] = yCbCr[2];
        newData[i + 3] = data[i + 3];
      }
    
      return newImageData;
    }
    function YcbcrToSmyk(imageData) {
      const data = imageData.data;
      const newImageData = new ImageData(imageData.width, imageData.height);
      const newData = newImageData.data;
    
      for (let i = 0; i < data.length; i += 4) {
        const y = data[i];
        const cb = data[i + 1] - 128;
        const cr = data[i + 2] - 128;
    
        // Convert YCbCr to RGB
        const r = y + 1.402 * cr;
        const g = y - 0.344136 * cb - 0.714136 * cr;
        const b = y + 1.772 * cb;
    
        // Convert RGB to CMYK
        const k = 1 - Math.max(r, g, b) / 255;
        const c = (1 - r / 255 - k) / (1 - k);
        const m = (1 - g / 255 - k) / (1 - k);
        const y1 = (1 - b / 255 - k) / (1 - k);
    
        // Store CMYK values in the new image data
        newData[i] = c * 255;
        newData[i + 1] = m * 255;
        newData[i + 2] = y * 255;
        newData[i + 3] = k * 255;
      }
    
      return newImageData;
    }
    function hslToLab(imageData) {
      const data = imageData.data;
      const newImageData = new ImageData(imageData.width, imageData.height);
      const newData = newImageData.data;
    
      for (let i = 0; i < data.length; i += 4) {
        const h = data[i] / 255;
        const s = data[i + 1] / 255;
        const l = data[i + 2] / 255;
    
        // Convert HSL to XYZ
        const x = hslToXyz(h, s, l)[0];
        const y = hslToXyz(h, s, l)[1];
        const z = hslToXyz(h, s, l)[2];
    
        // Convert XYZ to Lab
        const lab = xyzToLab(x, y, z);
    
        // Store Lab values in new image data
        newData[i] = lab[0] * 255;
        newData[i + 1] = lab[1] * 255;
        newData[i + 2] = lab[2] * 255;
        newData[i + 3] = data[i + 3]; // Preserve alpha channel
      }
    
      return newImageData;
    }
    function labToHsl(imageData) {
      const data = imageData.data;
      const newImageData = new ImageData(imageData.width, imageData.height);
      const newData = newImageData.data;
    
      for (let i = 0; i < data.length; i += 4) {
        const l = data[i] / 255;
        const a = data[i + 1] / 255;
        const b = data[i + 2] / 255;
    
        // Convert Lab to XYZ
        const xyz = labToXyz(l, a, b);
    
        // Convert XYZ to HSL
        const hsl = xyzToHsl(xyz[0], xyz[1], xyz[2]);
    
        // Store HSL values in new image data
        newData[i] = hsl[0] * 255;
        newData[i + 1] = hsl[1] * 255;
        newData[i + 2] = hsl[2] * 255;
        newData[i + 3] = data[i + 3]; // Preserve alpha channel
      }
    
      return newImageData;
    }
    function hslToHsv(imageData) {
      const data = imageData.data;
      const newImageData = new ImageData(imageData.width, imageData.height);
      const newData = newImageData.data;
    
      for (let i = 0; i < data.length; i += 4) {
        const h = data[i] / 255;
        const s = data[i + 1] / 255;
        const l = data[i + 2] / 255;
    
        // Convert HSL to HSV
        const hsv = hslToHsv(h, s, l);
    
        // Store HSV values in new image data
        newData[i] = hsv[0] * 255;
        newData[i + 1] = hsv[1] * 255;
        newData[i + 2] = hsv[2] * 255;
        newData[i + 3] = data[i + 3]; // Preserve alpha channel
      }
    
      return newImageData;
    }
    function hsvToHsl(imageData) {
      const data = imageData.data;
      const newImageData = new ImageData(imageData.width, imageData.height);
      const newData = newImageData.data;
    
      for (let i = 0; i < data.length; i += 4) {
        const h = data[i] / 255;
        const s = data[i + 1] / 255;
        const v = data[i + 2] / 255;
    
        // Convert HSV to HSL
        const hsl = hsvToHsl(h, s, v);
    
        // Store HSL values in new image data
        newData[i] = hsl[0] * 255;
        newData[i + 1] = hsl[1] * 255;
        newData[i + 2] = hsl[2] * 255;
        newData[i + 3] = data[i + 3]; // Preserve alpha channel
      }
    
      return newImageData;
    }
    function hslToYcbcr(imageData) {
      const data = imageData.data;
      const newImageData = new ImageData(imageData.width, imageData.height);
      const newData = newImageData.data;
    
      for (let i = 0; i < data.length; i += 4) {
        const h = data[i] / 255;
        const s = data[i + 1] / 255;
        const l = data[i + 2] / 255;
    
        // Convert HSL to YCbCr
        const ycbcr = hslToYcbcr(h, s, l);
    
        // Store YCbCr values in new image data
        newData[i] = ycbcr[0] * 255;
        newData[i + 1] = ycbcr[1] * 255;
        newData[i + 2] = ycbcr[2] * 255;
        newData[i + 3] = data[i + 3]; // Preserve alpha channel
      }
    
      return newImageData;
    }
    function ycbcrToHsl(imageData) {
      const data = imageData.data;
      const newImageData = new ImageData(imageData.width, imageData.height);
      const newData = newImageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const y = data[i];
        const cb = data[i + 1];
        const cr = data[i + 2];
        
        // Convert YCbCr to RGB
        const r = y + 1.402 * (cr - 128);
        const g = y - 0.34414 * (cb - 128) - 0.71414 * (cr - 128);
        const b = y + 1.772 * (cb - 128);
        
        // Convert RGB to HSL
        const hsl = rgbToHsl(r, g, b);
        
        // Set the new pixel data
        newData[i] = hsl.h;
        newData[i + 1] = hsl.s;
        newData[i + 2] = hsl.l;
        newData[i + 3] = data[i + 3];
        }
        
        return newImageData;
        }
    function labToHsv(imageData) {
      const data = imageData.data;
      const newImageData = new ImageData(imageData.width, imageData.height);
      const newData = newImageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const l = data[i];
        const a = data[i + 1];
        const b = data[i + 2];
            
        const h = Math.atan2(b, a);
        const s = Math.sqrt(a * a + b * b) / (l + 0.001);
        const v = l;
            
        newData[i] = h * 180 / Math.PI;
        newData[i + 1] = s * 100;
        newData[i + 2] = v * 100;
        newData[i + 3] = data[i + 3];
        }
            
        return newImageData;
        }

    function hsvToLab(imageData) {
      const data = imageData.data;
      const newImageData = new ImageData(imageData.width, imageData.height);
      const newData = newImageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const h = data[i] * Math.PI / 180;
        const s = data[i + 1] / 100;
        const v = data[i + 2] / 100;
                
        const a = s * Math.cos(h);
        const b = s * Math.sin(h);
        const l = v * (1 - s);
                
        newData[i] = l;
        newData[i + 1] = a;
        newData[i + 2] = b;
        newData[i + 3] = data[i + 3];
        }
                
        return newImageData;
        }
    function labToYcbcr(imageData) {
      const data = imageData.data;
      const newImageData = new ImageData(imageData.width, imageData.height);
      const newData = newImageData.data;
                  
        for (let i = 0; i < data.length; i += 4) {
          const l = data[i];
          const a = data[i + 1];
          const b = data[i + 2];
                    
          const y = 0.2126 * l + 0.7152 * a + 0.0722 * b;
          const cb = -0.1146 * l - 0.3854 * a + 0.5 * b + 128;
          const cr = 0.5 * l - 0.4542 * a - 0.0458 * b + 128;
                    
          newData[i] = y;
          newData[i + 1] = cb;
          newData[i + 2] = cr;
          newData[i + 3] = data[i + 3];
          }
                    
          return newImageData;
          }

    function ycbcrToLab(imageData) {
      const data = imageData.data;
      const newImageData = new ImageData(imageData.width, imageData.height);
      const newData = newImageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const y = data[i];
          const cb = data[i + 1] - 128;
          const cr = data[i + 2] - 128;
                        
          const l = 0.5644 * y - 0.3927 * cb - 0.0039 * cr;
          const a = 0.3956 * y - 0.5806 * cb + 0.2132 * cr;
          const b = 0.2115 * y + 0.5230 * cb - 0.3213 * cr;
                        
          newData[i] = l;
          newData[i + 1] = a;
          newData[i + 2] = b;
          newData[i + 3] = data[i + 3];
          }
                        
          return newImageData;
          }
    function hsvToYcbcr(imageData) {
      const data = imageData.data;
      const newImageData = new ImageData(imageData.width, imageData.height);
      const newData = newImageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const h = data[i];
          const s = data[i + 1];
          const v = data[i + 2];
              
          const y = 0.299 * r + 0.587 * g + 0.114 * b;
          const cb = -0.169 * r - 0.331 * g + 0.5 * b + 128;
          const cr = 0.5 * r - 0.419 * g - 0.081 * b + 128;
              
          newData[i] = y;
          newData[i + 1] = cb;
          newData[i + 2] = cr;
          newData[i + 3] = data[i + 3];
          }
              
          return newImageData;
          }

    function ycbcrToHsv(imageData) {
      const data = imageData.data;
      const newImageData = new ImageData(imageData.width, imageData.height);
      const newData = newImageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const y = data[i];
          const cb = data[i + 1] - 128;
          const cr = data[i + 2] - 128;
                  
          const r = y + 1.402 * cr;
          const g = y - 0.344 * cb - 0.714 * cr;
          const b = y + 1.772 * cb;
                  
          const h = Math.atan2(Math.sqrt(3) * (b - g), 2 * r - g - b) / (2 * Math.PI);
          const s = 1 - 3 * Math.min(r, g, b) / (r + g + b);
          const v = Math.max(r, g, b);
                  
          newData[i] = h;
          newData[i + 1] = s;
          newData[i + 2] = v;
          newData[i + 3] = data[i + 3];
          }
                  
          return newImageData;
          }
