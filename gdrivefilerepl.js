function listFiles() {
    const accessToken = localStorage.getItem('accessToken');
    const folderId = 'your_meet_video_folder_id'; // Replace with actual folder ID
    
    fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(name, owners(displayName), createdTime)`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then(response => response.json())
    .then(data => {
        const table = document.getElementById('fileTable');
        table.innerHTML = '<tr><th>File Name</th><th>Owner</th><th>Date</th></tr>' +
                          data.files.map(file => `
                              <tr>
                                  <td>${file.name}</td>
                                  <td>${file.owners[0].displayName}</td>
                                  <td>${new Date(file.createdTime).toLocaleString()}</td>
                              </tr>`
                          ).join('');
    })
    .catch(error => console.error('Error fetching files:', error));
}

document.addEventListener('DOMContentLoaded', listFiles);
