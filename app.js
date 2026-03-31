const API = "https://script.google.com/macros/s/AKfycbw7k1odAbzUp1MjAvrY8YT7skAwUiwlCq9eeIJ_W3nXlh4gtcr6wgE9ulMMzAwjYVRI/exec";

fetch(API)
.then(r => r.json())
.then(data => {

  let jobsHTML = "";
  data.jobs.forEach(j => {
    jobsHTML += `
    <div class="card">
      <b>${j.clinic}</b> - ${j.city}<br>
      ${j.position}<br>
      ${j.salary || "-"}<br>
      <a href="https://wa.me/${j.phone}" target="_blank">WhatsApp</a>
    </div>
    `;
  });
  document.getElementById("jobs").innerHTML = jobsHTML;

  let workersHTML = "";
  data.workers.forEach(w => {
    workersHTML += `
    <div class="card">
      <b>${w.name}</b> - ${w.city}<br>
      ${w.job} / ${w.position}<br>
      ${w.experience || ""}<br>
      <a href="https://wa.me/${w.phone}" target="_blank">WhatsApp</a>
    </div>
    `;
  });
  document.getElementById("workers").innerHTML = workersHTML;

});
