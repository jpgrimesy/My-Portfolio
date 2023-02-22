
//Classes and subclasses
class Spaceship {
    constructor() {
        this.hull = 20;
        this.firepower = 5;
        this.accuracy = .7;
    }
    attack() {
        if(Math.random() <= this.accuracy) {
            return true;
        } else {
            return false;
        }
    }
}
class Megaship extends Spaceship {
    constructor() {
        super();
        this.weaponPods = randomRange(2, 4)
    }
}
class Shwarz extends Spaceship {
    constructor() {
        super();
        this.missiles = 2;
    }
}
class Weaponpod {
    constructor() {
        this.hull = 5;
    }
}

//Global variables
const yourShip = new Shwarz();
let enemies = []
let megaArr = []
let podsArr = []
let score = 0;
let hMedals = 0;
let fMedals = 0;
let aMedals = 0;
let wave = 0;

//Random range generator
function randomRange(min, max) {
    if (max < 1) {
        let num = Math.random() * (max - min) + min;
        return parseFloat(num.toFixed(1))
    } else {
        let num = Math.floor(Math.random() * ((max + 1) - min) + min);
        return num
    }
}

// enemy/pod generators
function enemyGen() {
    let enemyCount = 6;
    while (enemyCount > 0) {
        const alienShip = new Spaceship();
        generateAlienStats(alienShip)
        alienShip.id = enemyCount;
        enemies.push(alienShip)
        enemyCount--;
    }
}
function enemyGenPlus() {
    let enemyCount = randomRange(6, 10);
    while (enemyCount > 0) {
        const alienShip = new Spaceship();
        generateAlienStats(alienShip)
        alienShip.id = enemyCount;
        enemies.push(alienShip)
        beefUp('alienPlus', alienShip)
        enemyCount--;
    }
    const megaShip = new Megaship()
    generateAlienStats(megaShip)
    megaArr.push(megaShip)
    podGen()
    if (wave > 1) {
        beefUp('megaPlus',megaShip)
    }
}
function podGen() {
    let totPods = megaArr[0].weaponPods;
    while (totPods > 0) {
        const pod = new Weaponpod();
        podsArr.push(pod);
        totPods--;
    }
}

//stat reset and stat generator
function resetStats() {
    yourShip.hull = 20 + wave;
    yourShip.firepower = 5 + wave;
    yourShip.accuracy = .7;
    yourShip.missiles = 2;
    medalCheck()
}
function generateAlienStats(alien) {
    alien.hull = randomRange(3, 6);
    alien.firepower = randomRange(2, 4);
    alien.accuracy = randomRange(.6, .8); 
}

//stat modifiers
function beefUp(stat, ship) {
    if (stat === 'alienPlus') {
        ship.hull = ship.hull + randomRange(2, 4) + (wave - 1)
        ship.firepower = ship.firepower + randomRange(1, 2) + (wave - 1)
    } else if (stat === 'megaPlus') {
        ship.weaponPods + (wave - 1);
        beefUp('alienPlus', ship);
    } else if (stat === 'yourStats') {
        yourShip.hull = yourShip.hull + randomRange(8, 13) + (wave - 1);
        yourShip.firepower = yourShip.firepower + randomRange(1, 3) + (wave - 1);
        yourShip.missiles = yourShip.missiles + randomRange(1, 2) + (wave - 1);
        console.log(`Professor Frink's team has re-equiped you with ${yourShip.missiles} missiles and have upgraded your ship! Your lasers now do ${yourShip.firepower} damage!\nThey also managed to run the ship under the Shield-O-Matic(patent pending) and increased your shields to ${yourShip.hull} durability`)
    } else if (stat === 'hull') {
        yourShip.hull = yourShip.hull + (6 * hMedals);
        console.log(`You now have ${yourShip.hull} durability!`)
    } else if (stat === 'fire') {
        yourShip.firepower = yourShip.firepower + (3 * fMedals)
        console.log(`You now give out ${yourShip.firepower} damage!`)
    } else if (stat === 'acc') {
        yourShip.accuracy = ((yourShip.accuracy * 10) + 1) / 10
        console.log(`You now have ${yourShip.accuracy * 100}% accuracy!`)
    }
}

//hero and enemy+crit attack rolls
function attackEnemy(enemy) {
    if (yourShip.attack() === true) {
        enemy.hull -= yourShip.firepower;
        console.log('***Hit!***')
    } else {
        console.log('Swing and a miss!')
    }
    checkEnemyStatus(enemy)
}
function attackMegaShip (enemy, pod) {
    if(yourShip.attack() === true) {
        if(podsArr.length > 0) {
            pod.hull -= yourShip.firepower
            console.log('You damaged a weapon pod!')
        } else {
            enemy.hull -= yourShip.firepower
            console.log('You hit the MEGA SHIP!')
        }
    } else {
        console.log('The MEGA SHIP wasn\'t affected by your guns!')
    }
    checkMegaStatus(enemy, pod)
}
function missileAttack(enemy) {
    if(yourShip.attack() === true) {
        enemy.hull -= 20;
        console.log('***BOOM-SHAKALAKA***')
    } else {
        console.log('OH SNAP! The alien applied counter measures!')
    }
    yourShip.missiles --;
    if (yourShip.missiles > 0) {
        console.log(`You have ${yourShip.missiles} missile(s) left`)
    } else {
        console.log('You\'re out of missiles!')
    }
    checkEnemyStatus(enemy)
}
function megaMissleAtt(enemy, pod) {
    console.clear()
    if (yourShip.attack() === true) {
        if(podsArr.length > 0) {
            pod.hull -= 20
            console.log('You hit its weapon pod!')
        } else {
            enemy.hull -= 20
        }
    } else {
        console.log('The MEGA SHIP took your missile and spit it out! Waahhh??!!')
    }
    yourShip.missiles--;
    if (yourShip.missiles > 0) {
        console.log(`You have ${yourShip.missiles} missile(s) left`)
    } else {
        console.log("You're out of missiles!")
    }
    checkMegaStatus(enemy, pod)
}
function megaAttack(enemy, pod) { 
    if (enemy.attack() === true) {
        yourShip.hull -= enemy.firepower + enemy.weaponPods
        console.log(`Something bit you! You got hit for ${enemy.firepower + enemy.weaponPods} damage! Sheeeeesh! You've got ${yourShip.hull} hits left on your shields!`)
    } else {
        console.log('You managed to avoid its mega-lasers!')
    }
    statusAgainstMega(enemy, pod)
}
function attackYou(enemy) {
    if(enemy.attack() === true) {
        yourShip.hull -= enemy.firepower;
        console.log(`You got hit! You've got ${yourShip.hull} hits left on your shields!`)
        critRoll(enemy)
    } else {
        console.log('You dodged the enemy\'s lasers!')
    }
    checkYourStatus(enemy)
}
function critRoll(enemy) {
    if (Math.random() <= 0.2) {
        console.log('Alien wants to regulate! It\'s attacking again!')
        attackYou(enemy)
    } else {
        checkYourStatus(enemy) 
    }
}

//status checks
function checkYourStatus(enemy) {
    if(yourShip.hull > 0) {
        attackEnemy(enemy)
    } else {
        gameOver()
    }
}
function checkEnemyStatus(enemy) {
    if (enemy.hull > 0) {
        console.log(`Enemy hull needs ${enemy.hull} more damage!`)
        attackYou(enemy)
    } else {
        let index = enemies.findIndex(x => x.id === enemy.id)
        console.log('You destroyed an enemy ship!')
        enemies.splice(index, 1)
        score++
        checkEnemyCount()
    }
}
function checkMegaStatus(enemy, pod) {
    if (enemy.hull > 0 && pod.hull > 0) {
        megaAttack(enemy, pod)
    } else if (enemy.hull > 0 && pod.hull <= 0) {
        if (enemy.weaponPods > 1) {
        console.log(`You destroyed a weapon pod! There are ${enemy.weaponPods} left!`)
        enemy.weaponPods--;
        podsArr.shift()
        megaAttack(enemy, pod)
        } else {
            console.log('You destroyed all weapon pods!')
            enemy.weaponPods--;
            podsArr.shift()
            megaAttack(enemy, pod)
        }
    } else if (enemy.hull > 0 && podsArr.length === 0) {
        megaAttack(enemy, pod)
    } else {
        console.log('YOU DID IT! YOU DESTROYED THE MEGA SHIP AND THE REST OF THE WAVE!')
        score += 3
        megaArr.pop()
        anotherWave()
    }
}
function statusAgainstMega(enemy, pod) {
    if (yourShip.hull > 0) {
        if (yourShip.missiles > 0) {
            askMegaMissile(enemy, pod)
        } else {
            attackMegaShip(enemy, pod)
        }
    } else {
        gameOver()
    }
}

//status checks
function checkEnemyCount() {
    if(enemies.length > 0) {
        while(true) {
            console.log(`You have ${yourShip.hull} hits left on your shield\nKeep fighting? (Y)es or (N)o`)
            let userInput = prompt ('')
            if (userInput.toLowerCase() === 'y') {
                console.clear()
                chooseEnemy()
            } else if (userInput.toLowerCase() === 'n') {
                console.log('The aliens have conquered Earth! But there still might be a chance!')
                continueScreen()
                resetGame()
            }
        }
    } else if(enemies.length === 0 && megaArr.length > 0) {
        logMShip()
        console.log(`DUN! DUN! DUN!\nTHE MEGA SHIP HAS ARRIVED!\nAre you ready for this? (Y)es (N)o\n[shields: ${yourShip.hull}]`)
        while(true) {
            let userInput = prompt('')
            if (userInput.toLowerCase() === 'y') {
                if(yourShip.missiles > 0) {
                    askMegaMissile(megaArr[0], podsArr[0])
                } else {
                    console.clear()
                    attackMegaShip(megaArr[0], podsArr[0])
                }
            } else if (userInput.toLowerCase() === 'n') {
                console.log('The MEGA SHIP blew up the White House ID4 style and Earth has been taken over! But there still might be a chance!')
                continueScreen();
                resetGame();
            }
        }
    } else {
        console.log('YOU DID IT! YOU\'VE DEFEATED THE ENEMY WAVE!')
        anotherWave()
    }
}
//score awards system
function checkScore() {
    let totalMedals = aMedals + hMedals + fMedals
    if (score >= 10 && totalMedals === 0) {
        console.log(`You have received a Medal for Marksmanship!\nYou have a choice of what it will improve: `)
        askUpgrade()
    } else if (score >= 20 && totalMedals === 1) {
        console.log(`You have received another medal! The Medal for Sandracing!\nWhat will it improve?`)
        askUpgrade()
    } else if (score >= 30 && totalMedals === 2) {
        console.log(`You did it! You have received the ultimate honor! A statue of Keanua Reeves!\nHow will it improve your ship?`)
        askUpgrade()
    }
}
function medalCheck() {
    if (hMedals > 0) {
        yourShip.hull = yourShip.hull + (6 * hMedals);
    } else if (fMedals > 0) {
        yourShip.firepower = yourShip.firepower + (3 * fMedals)
    } else if (aMedals > 0) {
        yourShip.accuracy = ((yourShip.accuracy * 10) + aMedals) / 10
    }
}
function askUpgrade() {
    while(true) {
        console.log('Improve (H)ealth, (F)irepower, or (A)accuracy?')
        let userInput = prompt('')
        if(userInput.toLowerCase() === 'h') {
            hMedals++;
            beefUp('hull')
            break
        } else if (userInput.toLowerCase() === 'f') {
            fMedals++;
            beefUp('fire')
            break
        } else if (userInput.toLowerCase() === 'a') {
            aMedals++;
            beefUp('acc')
            break
        }
    }
}
//missile prompt
function askMissile(enemy) {
    while(true) {
        console.log(`Would you like to use your missile? (Y)es or (N)o [missiles: ${yourShip.missiles}]`)
        let userInput = prompt('')
        if (userInput.toLowerCase() === 'y') {
            console.clear()
            missileAttack(enemy)
        } else if (userInput.toLowerCase() === 'n') {
            console.clear()
            attackEnemy(enemy)
        }
    }
}
function askMegaMissile(enemy, pod) {
    while(true) {
        console.log(`Would you like to you use a missile? (y)es or (n)o [missiles: ${yourShip.missiles}] `)
        let userInput = prompt('')
        if (userInput === 'y') {
            megaMissleAtt(enemy, pod)
        } else if (userInput === 'n') {
            attackMegaShip(enemy, pod)
        }
    }
}

//weapon targeting
function chooseEnemy() {
    let current = []
    for (let i = 0; i < enemies.length; i++) {
        let shipString = `<(${i + 1})> HP: ${enemies[i].hull}`
        current.push(shipString)
    }
    console.log('You see ' + enemies.length + ' alien ship(s)')
    console.log(current)
    while (true) {
        console.log('Which enemy do you want to attack?')
        let userInput = prompt('Choose between 1 and ' + enemies.length +': ', 'Make a choice!')
        if(userInput <= enemies.length && userInput !== 0){
            if(yourShip.missiles > 0) {
                askMissile(enemies[userInput - 1])
            } else {
                console.clear()
                attackEnemy(enemies[userInput - 1])
            }
        } 
    }
}

function startGame() {
    console.clear()
    console.log('< S >< P >< A >< C >< E >  < B >< A >< T >< T >< L >< E >');
    console.log('\n\n***WARNING***\nAn alien fleet is incoming!\n\n')
    while(true){
        console.log('Board the USS Scwharzenegger and smoke these suckaz? (Y)es or (N)o')
        let userInput = prompt ('')
    if (userInput.toLowerCase() === 'y') {
            enemyGen();
            pressEnter();
            chooseEnemy();
            answered = true
        } else if (userInput.toLowerCase() === 'n') {
            console.log('BITCH!')
            answered = true
        }
    }
}
//new game+ feature
function anotherWave() {
    console.log('However, another wave is incoming!\nAre you thirsty for more?');
    while(true) {
        let userInput = prompt('')
        if (userInput.toLowerCase() === 'y') {
            console.clear();
            console.log(`Current Score: ${score}\nYou head back to your base to reload, recharge and get ready`);
            wave++;
            resetStats();
            beefUp('yourStats');
            enemyGenPlus();
            checkScore();
            pressEnter();
            chooseEnemy();
        }
    }
}
function pressEnter() {
    prompt('\nYou\'ve boarded! Hit enter to use the Schwarz!')
    console.clear()
}
function resetGame() {
    score = 0;
    hMedals = 0;
    aMedals = 0;
    fMedals = 0;
    wave = 0;
    enemies = [];
    megaArr = [];
    podsArr = [];
    resetStats();
    startGame()
}
function continueScreen() {
    prompt('Hit enter to take your Deloreon to 88!')
    resetGame()
}
function gameOver() {
    console.log(`GAME OVER\nYour score: ${score}\nTake the Deloreon to 88 and try again? (Y)es or (N)o`)
        while(true) {
        let userInput = prompt('')
        if(userInput === 'y') {
            resetGame();
        } else if(userInput ==='n') {
            console.log('WE ARE DOOMED! THANKS FOR NOTHING!')
            continueScreen()
        }
    }
}
