import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const out = join(root, "out");
const input = readFileSync(join(out, "index.html"), "utf8");
const cssHref = input.match(/<link rel="stylesheet" href="([^"]+)"/)?.[1];

if (!cssHref) {
  throw new Error("Could not find exported stylesheet.");
}

const css = readFileSync(join(out, cssHref.replace(/^\//, "")), "utf8");

const standaloneScript = `
<script>
document.querySelectorAll('[style]').forEach(function (element) {
  element.style.removeProperty('opacity');
  element.style.removeProperty('transform');
});

function scrollToSection(id) {
  var target = document.getElementById(id);
  if (target) target.scrollIntoView({ behavior: 'smooth' });
}

var brand = document.querySelector('.brand');
var navButtons = document.querySelectorAll('.nav nav button');
var primary = document.querySelector('.primary-button');

if (brand) brand.addEventListener('click', function () { scrollToSection('home'); });
if (navButtons[0]) navButtons[0].addEventListener('click', function () { scrollToSection('work'); });
if (navButtons[1]) navButtons[1].addEventListener('click', function () { scrollToSection('about'); });
if (primary) primary.addEventListener('click', function () { scrollToSection('work'); });

var detailCopy = [
  '<div class="funnel"><div class="funnel-heading"><span>APP STORE CONVERSION</span><strong>自然流量转化漏斗</strong></div><div class="funnel-list">' +
  [
    ['','6,493','展示次数','100%','#6758E8'],
    ['10.6%','688','产品页查看','78%','#7B6CF6'],
    ['12.4%','85','首次下载','58%','#988DF7'],
    ['116.5%','99','付费销量','40%','#B8B0FA']
  ].map(function(item) {
    return '<div class="funnel-stage"><div class="conversion">' + (item[0] ? '<span>↓</span><b>' + item[0] + '</b>' : '') + '</div><div class="funnel-bar" style="width:' + item[3] + ';background-color:' + item[4] + '"></div><div class="funnel-meta"><strong>' + item[1] + '</strong><span>' + item[2] + '</span></div></div>';
  }).join('') + '</div></div>',
  '<div class="project-detail"><span>ROLE & SCOPE</span><p>从产品定义、体验设计到开发部署，独立推动完整链路落地，并持续以真实反馈迭代。</p></div>',
  '<div class="project-detail"><span>ROLE & SCOPE</span><p>从产品定义、体验设计到开发部署，独立推动完整链路落地，并持续以真实反馈迭代。</p></div>'
];

document.querySelectorAll('.project-card').forEach(function(card, index) {
  var button = card.querySelector('button.project-action');
  if (!button) return;
  button.addEventListener('click', function() {
    var existing = card.querySelector('.funnel, .project-detail');
    if (existing) {
      existing.remove();
      card.classList.remove('is-open');
      button.innerHTML = (index === 0 ? '查看转化数据' : '查看详情') + ' <span>→</span>';
      return;
    }
    card.classList.add('is-open');
    button.insertAdjacentHTML('afterend', detailCopy[index]);
    button.innerHTML = '收起详情 <span>↑</span>';
  });
});
</script>`;

let html = input
  .replace(/<link rel="stylesheet"[^>]*>/g, `<style>${css}</style>`)
  .replace(/<link rel="preload"[^>]*>/g, "")
  .replace(/<link rel="icon"[^>]*>/g, "")
  .replace(/<script[\s\S]*?<\/script>/g, "")
  .replace(/style="opacity:0;transform:[^"]+"/g, "")
  .replace("</body>", `${standaloneScript}</body>`);

writeFileSync(join(out, "standalone.html"), html, "utf8");
console.log(join(out, "standalone.html"));
