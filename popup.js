document.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('content');

  const createSummaryElement = (title, summary) => {
    const div = document.createElement('div');
    div.className = 'summary';
    div.innerHTML = `
      <h2>${title}</h2>
      <p>Limit: ${summary.limit} ${summary.volume_unit}</p>
      <p>Used: ${summary.used} ${summary.volume_unit}</p>
    `;
    return div;
  };

  const displayData = (data) => {
    const { my_package_summary, bonus_data_summary, vas_data_summary, extra_gb_data_summary, my_package_info } = data.dataBundle;

    content.appendChild(createSummaryElement('My Package Summary', my_package_summary));
    content.appendChild(createSummaryElement('Bonus Data Summary', bonus_data_summary));
    content.appendChild(createSummaryElement('VAS Data Summary', vas_data_summary));
    content.appendChild(createSummaryElement('Extra GB Data Summary', extra_gb_data_summary));

    const packageInfoDiv = document.createElement('div');
    packageInfoDiv.className = 'summary';
    packageInfoDiv.innerHTML = `
      <h2>Package Info: ${my_package_info.package_name}</h2>
      <p>Reported Time: ${my_package_info.reported_time}</p>
      <p>Usage Details:</p>
      <ul>
        ${my_package_info.usageDetails.map(detail => `
          <li>
            ${detail.name}: ${detail.used}/${detail.limit} ${detail.volume_unit} used, ${detail.remaining} ${detail.volume_unit} remaining
          </li>
        `).join('')}
      </ul>
    `;
    content.appendChild(packageInfoDiv);
  };

  var subscriberID = '';
  var token = '';
  var clientId = '';

  fetch('https://omniscapp.slt.lk/mobitelint/slt/api/BBVAS/UsageSummary?subscriberID=' + subscriberID, {
    method: 'GET',
    headers: {
      'Authorization': 'bearer ' + token,
      'X-IBM-Client-Id': clientId
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.isSuccess) {
      displayData(data);
    } else {
      content.innerHTML = '<p>Failed to fetch data</p>';
    }
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    content.innerHTML = '<p>Error fetching data</p>';
  });
});
