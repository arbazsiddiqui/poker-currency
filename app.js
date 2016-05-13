var players = new Firebase('https://pokercurrency.firebaseio.com/players');
var pot = new Firebase('https://pokercurrency.firebaseio.com/pot');

function addPlayers() {
    var playerName = document.getElementById('playerName').value.trim()
    var amount = document.getElementById('amount').value.trim()
    players.push({
        name: playerName,
        amount: amount
    });
}

players.on("value", function (snapshot) {
    var data = snapshot.val();
    var list = [];
    for (var key in data) {
        name = data[key].name;
        amount = data[key].amount;
        list.push({
            name: name,
            amount: Number(amount),
            key: key
        })
    }
    refreshUI(list);
});

pot.on("value", function(snapshot){
   var data = snapshot.val();
   document.getElementById('pot').innerHTML = data.value;
});

function refreshUI(list) {
    var lis = '';
    for (var i = 0; i < list.length; i++) {
        lis += '<li class="list-group-item" data-key=' + list[i].key + '>' + list[i].name + '   ' + list[i].amount + ' [' + genLinks(list[i].key, list[i].name) + ']'+'</li>';
    }
    document.getElementById('playing').innerHTML = lis;

}

function genLinks(key, name) {
    var links = '';
    links += '<a href="javascript:bet(\'' + key + '\',\'' + name + '\')">Bet</a> |   ';
    links += '<a href="javascript:givePot(\'' + key + '\',\'' + name + '\')">Give pot</a>';
    return links;
}

function bet(key, name) {
    var user = new Firebase('https://pokercurrency.firebaseio.com/players/' + key);
    var data={};
    user.on("value", function(snapshot){
        data = snapshot.val();
    });
    var bet = prompt("How much you want to bet", 50);
    var newAmount = parseInt(data.amount) - bet;
    user.update({
        amount: newAmount
    });
    pot.on("value", function(snapshot){
        data=snapshot.val();
    });
    var curPot = data.value;
    var newPot = parseInt(curPot) + parseInt(bet);
    pot.update({
        value : newPot
    })

}

function reset(){
    players.remove();
    pot.update({
        value : 0
    })
}