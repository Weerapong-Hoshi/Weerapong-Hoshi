const SkillIcon = (skill, base64Data, isLegend = false) => {
  // ดึง bounceDur มาจาก config (ถ้าไม่มีให้ default ที่ 0.6s)
  const { name, color, speed, delay, bounceDur = "0.6s" } = skill;

  if (isLegend) {
    return `
      <g>
        <rect x="-16" y="-16" width="32" height="32" rx="7" fill="${color}" opacity="0.15"/>
        <image x="-10" y="-10" width="20" height="20" href="${base64Data}" />
      </g>`;
  }

  return `
    <g filter="url(#shadow)">
      <!-- Shadow on sand: ปรับความเร็วตามการเด้ง -->
      <ellipse cx="0" cy="0" rx="18" ry="4" fill="#000" opacity="0.3">
        <animateMotion dur="${speed}" begin="${delay}" repeatCount="indefinite" path="M 70 173 L 890 172"/>
        <animate attributeName="rx" values="18;8;18" dur="${bounceDur}" begin="${delay}" repeatCount="indefinite"/>
      </ellipse>

      <g>
        <!-- การเคลื่อนที่แนวนอน (วิ่ง) -->
        <animateMotion dur="${speed}" begin="${delay}" repeatCount="indefinite" path="M 70 151 L 890 150"/>
        
        <g>
           <!-- การเคลื่อนที่แนวตั้ง (กระโดดเด้งดึ๋ง) -->
           <!-- ใส่ begin="${delay}" เพื่อให้มันเริ่มกระโดดไม่พร้อมกันตอนออกตัว -->
           <animateTransform attributeName="transform" type="translate" additive="sum"
             values="0,0; 0,-32; 0,0" 
             keyTimes="0; 0.5; 1" 
             dur="${bounceDur}" 
             begin="${delay}" 
             repeatCount="indefinite" 
             calcMode="spline" 
             keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"/>
           
           <rect x="-21" y="-21" width="42" height="42" rx="10" fill="${color}"/>
           <rect x="-21" y="-21" width="42" height="42" rx="10" fill="none" stroke="white" stroke-width="2" opacity="0.3"/>
           <image x="-14" y="-14" width="28" height="28" href="${base64Data}" />
        </g>
      </g>
    </g>`;
};

module.exports = SkillIcon;
