const colors = [
  ['#fff0cf','#f7cb82','#eb8e49','#b85a27'],
  ['#ffe7e4','#f5b5b7','#dd7b8d','#a44d66'],
  ['#e3f4ec','#acd9c8','#70b8a1','#397d70'],
  ['#e9e7ff','#c5baf0','#9a84d1','#674f9c'],
  ['#e4f3ff','#addaee','#69acca','#387ca0'],
];

const marks = {
  dog: '<ellipse cx="44" cy="53" rx="12" ry="23" fill="url(#deep)" transform="rotate(22 44 53)"/><ellipse cx="116" cy="53" rx="12" ry="23" fill="url(#deep)" transform="rotate(-22 116 53)"/><ellipse cx="80" cy="64" rx="35" ry="30" fill="url(#front)"/><ellipse cx="80" cy="76" rx="21" ry="14" fill="#fff3dd"/><path d="M74 71Q80 67 86 71Q84 79 80 79T74 71Z" fill="#3e2926"/><circle cx="66" cy="60" r="3.5" fill="#3e2926"/><circle cx="94" cy="60" r="3.5" fill="#3e2926"/>',
  cat: '<path d="M47 64L49 28Q53 22 59 29L71 42H89L103 28Q109 22 111 30L113 64Z" fill="url(#deep)"/><ellipse cx="80" cy="67" rx="35" ry="27" fill="url(#front)"/><path d="M63 64l5-2m24 0 5 2m-20 7 3 3 3-3m-23 5-11-2m12 7-11 2m50-7 11-2m-12 7 11 2" fill="none" stroke="#483340" stroke-width="2.8" stroke-linecap="round"/>',
  rabbit: '<ellipse cx="65" cy="43" rx="11" ry="31" fill="url(#front)" transform="rotate(-13 65 43)"/><ellipse cx="94" cy="43" rx="11" ry="31" fill="url(#front)" transform="rotate(13 94 43)"/><ellipse cx="80" cy="73" rx="33" ry="24" fill="url(#front)"/><circle cx="69" cy="69" r="3" fill="#493e66"/><circle cx="91" cy="69" r="3" fill="#493e66"/><path d="M75 77Q80 74 85 77L80 82Z" fill="#834861"/>',
  heart: '<path d="M80 94 48 65C27 42 60 22 80 44 100 22 133 42 112 65Z" fill="url(#front)"/><path d="M50 56Q46 46 57 42" stroke="#fff" stroke-opacity=".7" stroke-width="4" fill="none" stroke-linecap="round"/>',
  bag: '<path d="M56 32H105L110 84Q110 94 100 94H61Q50 94 50 84Z" fill="url(#front)"/><path d="M57 39h47M56 84h49" stroke="#fff" opacity=".65" stroke-width="3"/><ellipse cx="80" cy="63" rx="16" ry="13" fill="#fff4da"/><circle cx="80" cy="64" r="5" fill="url(#deep)"/><circle cx="73" cy="58" r="2.5" fill="url(#deep)"/><circle cx="80" cy="55" r="2.5" fill="url(#deep)"/><circle cx="87" cy="58" r="2.5" fill="url(#deep)"/>',
  bowl: '<ellipse cx="80" cy="58" rx="37" ry="10" fill="url(#deep)"/><path d="M42 58h76l-6 24q-2 8-11 8H59q-9 0-11-8Z" fill="url(#front)"/><path d="M49 66q31 10 62 0" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3"/><circle cx="62" cy="54" r="5" fill="#ad713b"/><circle cx="73" cy="51" r="5" fill="#c98a45"/><circle cx="86" cy="55" r="5" fill="#ad713b"/><circle cx="99" cy="53" r="5" fill="#c98a45"/>',
  bone: '<path d="M52 49q-11-9-18 0-7 9 3 16-10 8-3 16 7 9 18 0h56q11 9 18 0 7-8-3-16 10-7 3-16-7-9-18 0Z" fill="url(#front)" transform="rotate(-17 80 65)"/><path d="m60 60 36-10" stroke="#fff" stroke-opacity=".6" stroke-width="4" stroke-linecap="round"/>',
  collar: '<ellipse cx="80" cy="62" rx="39" ry="22" fill="none" stroke="url(#front)" stroke-width="12" transform="rotate(-16 80 62)"/><rect x="89" y="64" width="23" height="18" rx="5" fill="#fff5cd" transform="rotate(-16 89 64)"/><circle cx="89" cy="87" r="9" fill="#ffc45c"/>',
  house: '<path d="M43 59 80 29l37 30v33H43Z" fill="url(#front)"/><path d="M40 61 80 27l40 34" fill="none" stroke="url(#deep)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M66 92V76a14 14 0 0 1 28 0v16Z" fill="#fff2e5"/>',
  brush: '<g transform="rotate(-29 80 64)"><rect x="75" y="63" width="10" height="37" rx="5" fill="url(#deep)"/><rect x="58" y="35" width="44" height="39" rx="15" fill="url(#front)"/><rect x="64" y="41" width="32" height="25" rx="10" fill="#fff1ed" fill-opacity=".8"/><path d="M71 49v9m6-9v9m6-9v9m6-9v9" stroke="url(#deep)" stroke-width="2.5" stroke-linecap="round"/></g>',
  bottle: '<rect x="69" y="26" width="22" height="15" rx="5" fill="url(#deep)"/><rect x="57" y="39" width="46" height="55" rx="12" fill="url(#front)"/><rect x="63" y="55" width="34" height="22" rx="6" fill="#fff" fill-opacity=".75"/><path d="M80 59q12 11 0 15-12-4 0-15Z" fill="url(#deep)"/>',
  hospital: '<rect x="43" y="48" width="74" height="45" rx="9" fill="url(#front)"/><rect x="61" y="31" width="38" height="39" rx="8" fill="url(#deep)"/><path d="M80 40v19m-9-9h18" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M72 93V78h16v15" fill="#fff4de"/><path d="M52 73h11m34 0h11" stroke="#fff" stroke-opacity=".75" stroke-width="4" stroke-linecap="round"/>',
  calendar: '<rect x="48" y="36" width="64" height="57" rx="10" fill="url(#front)"/><path d="M48 51h64m-49-21v12m34-12v12" stroke="url(#deep)" stroke-width="5" stroke-linecap="round"/><path d="m66 72 8 8 20-20" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  ball: '<circle cx="80" cy="63" r="34" fill="url(#front)"/><path d="M57 38q27 12 14 57m42-47Q87 54 99 89" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="4"/><ellipse cx="67" cy="45" rx="8" ry="4" fill="#fff" fill-opacity=".5" transform="rotate(-28 67 45)"/>',
  feather: '<path d="M103 29C68 29 61 53 65 78c25 4 47-17 38-49Z" fill="url(#front)"/><path d="M52 97 96 38M65 78l16-3m-7-10 15-4" stroke="url(#deep)" stroke-width="4" fill="none" stroke-linecap="round"/>',
  leaf: '<path d="M106 34C74 30 50 52 62 80c31 12 50-14 44-46Z" fill="url(#front)"/><path d="M54 89 98 44M69 72l17 1m-8-10-1-10" stroke="url(#deep)" stroke-width="4" fill="none" stroke-linecap="round"/>',
  tag: '<path d="M47 63 78 32h32v33L80 95q-4 4-9-1L47 71q-5-4 0-8Z" fill="url(#front)"/><circle cx="97" cy="46" r="5" fill="#fff3df"/><path d="m66 69 21 0" stroke="#fff" stroke-width="4" stroke-linecap="round"/><circle cx="71" cy="61" r="3" fill="#fff"/><circle cx="83" cy="77" r="3" fill="#fff"/>',
  gift: '<rect x="46" y="52" width="68" height="41" rx="7" fill="url(#front)"/><rect x="41" y="46" width="78" height="14" rx="5" fill="url(#deep)"/><path d="M80 91V47m0 0C52 46 66 20 80 47Zm0 0c28-1 14-27 0 0Z" stroke="#fff5df" stroke-width="5" fill="none" stroke-linecap="round"/>',
  paw: '<path d="M59 78q5-10 13-15t16 0q9 5 13 15 3 12-9 13-5 0-12-4-7 4-12 4-12-1-9-13Z" fill="url(#front)"/><ellipse cx="56" cy="61" rx="7" ry="10" fill="url(#deep)" transform="rotate(-24 56 61)"/><ellipse cx="70" cy="48" rx="7" ry="11" fill="url(#front)"/><ellipse cx="90" cy="48" rx="7" ry="11" fill="url(#front)"/><ellipse cx="104" cy="61" rx="7" ry="10" fill="url(#deep)" transform="rotate(24 104 61)"/>',
  more: '<rect x="41" y="40" width="78" height="48" rx="22" fill="url(#front)"/><circle cx="63" cy="64" r="4.5" fill="#fff"/><circle cx="80" cy="64" r="4.5" fill="#fff"/><circle cx="97" cy="64" r="4.5" fill="#fff"/>',
};

function illustration(mark, palette, wide = false) {
  const [paper, shade, color, deep] = colors[palette % colors.length];
  const [width,height,bgHeight,dx,dy,scale] = wide ? [320,240,240,20,8,1.75] : [160,160,160,0,20,1];
  return '<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'">'+
    '<defs><linearGradient id="paper" x2="1" y2="1" gradientUnits="objectBoundingBox"><stop stop-color="'+paper+'"/><stop offset="1" stop-color="'+shade+'"/></linearGradient>'+
    '<linearGradient id="front" x2=".75" y2="1"><stop stop-color="'+shade+'"/><stop offset="1" stop-color="'+color+'"/></linearGradient>'+
    '<linearGradient id="deep" x2="1" y2="1"><stop stop-color="'+color+'"/><stop offset="1" stop-color="'+deep+'"/></linearGradient></defs>'+
    '<rect width="'+width+'" height="'+bgHeight+'" rx="'+(wide?0:26)+'" fill="url(#paper)"/>'+
    '<g transform="translate('+dx+' '+dy+') scale('+scale+')"><ellipse cx="80" cy="103" rx="43" ry="7" fill="'+deep+'" opacity=".17"/>'+
    marks[mark]+'</g></svg>';
}

module.exports = {illustration};
