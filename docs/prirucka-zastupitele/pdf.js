const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{
  const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});
  const p=await b.newPage();
  await p.goto('file:///home/claude/prirucka-zastupitele/out/print.html',{waitUntil:'load'});
  await p.evaluate(()=>document.fonts.ready);
  await p.pdf({path:'/home/claude/prirucka-zastupitele/out/prirucka-zastupitele.pdf',format:'A4',printBackground:true,preferCSSPageSize:true,
    displayHeaderFooter:true,headerTemplate:'<span></span>',
    footerTemplate:'<div style="width:100%;font-family:Arial;font-size:8px;color:#777;padding:0 18mm;display:flex;justify-content:space-between"><span>Příručka pirátského zastupitele · stav k 26. 11. 2026</span><span class="pageNumber"></span></div>'});
  await b.close();
})();
