const fetch = require("node-fetch");

async function getBase64Icon(id) {
  // แมพ ID ให้ตรงกับ DevIcon
  const iconMap = {
    csharp: "csharp/csharp-original.svg",
    javascript: "javascript/javascript-original.svg",
    unity: "unity/unity-original.svg",
    cplusplus: "cplusplus/cplusplus-original.svg",
    unrealengine: "unrealengine/unrealengine-original.svg",
    html5: "html5/html5-original.svg",
    css3: "css3/css3-original.svg",
    blender: "blender/blender-original.svg",
    docker: "docker/docker-original.svg",
    python: "python/python-original.svg",
    php: "php/php-original.svg",
    "dot-net": "dot-net/dot-net-original.svg",
  };

  const path = iconMap[id] || `${id}/${id}-original.svg`;
  const url = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Icon not found: ${id}`);
    const buffer = await response.buffer();
    return `data:image/svg+xml;base64,${buffer.toString("base64")}`;
  } catch (err) {
    console.warn(`⚠️ Could not load icon for ${id}, using fallback.`);
    // ส่งรูปสี่เหลี่ยมสีเทาเป็น Fallback ถ้าโหลดไม่ได้
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjNDQ0Ii8+PC9zdmc+";
  }
}

module.exports = { getBase64Icon };
