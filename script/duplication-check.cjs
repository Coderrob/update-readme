const { execSync } = require('child_process');
const fs = require('fs');

try {
  execSync('jscpd src/ -r json', { stdio: 'inherit' });
  const data = JSON.parse(fs.readFileSync('report/jscpd-report.json', 'utf8'));
  const percentage = data.statistics.total.percentage;
  console.log(`Duplication rate: ${percentage}%`);
  if (percentage > 2) {
    console.error(`Duplication rate ${percentage}% exceeds 2% threshold`);
    process.exit(1);
  }
} catch (e) {
  console.error('Error running jscpd:', e.message);
  process.exit(1);
}
