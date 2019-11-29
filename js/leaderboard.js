//data fetching
var db = initFirestore();
var leaderData;
fetchLeaderboard(db).then(([err, res]) => {
    if (!err) {
        populateTable(res);
    }
});
function populateTable(leaderData) {
    console.log(leaderData);
    for (const [i, o] of leaderData.entries()) { o.rank = i + 1 };
    let table = $('#results').DataTable({
        ordering: false,
        dom: 't',
        data: leaderData,
        autoWidth: true,
        pageLength: 25,
        columns: [
            { title: 'RANK', data: 'rank', width: '33%' },
            { title: 'USER', data: 'name', width: '33%' },
            { title: 'SCORE', data: 'score', width: '33%' }
        ]
    });
}

//overlay event
function overlayOn() {
    document.getElementById("overlay").style.display = "block";
}
function overlayOff() {
    document.getElementById("overlay").style.display = "none";
}
