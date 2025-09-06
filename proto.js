function clamp(max, min, value) {
    return Math.min(Math.max(value, min), max);
}

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function isAttackSpell(attack) {
    return Object.hasOwn(attack, 'manaConsumption');
}

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

class Spellcaster {
    constructor(name, maxHealth, maxMana, spells) {
        // Limits. idk how to make them constant
        this.maxMana = maxMana;
        this.minMana = 0;
        this.maxHealth = maxHealth;
        this.minHealth = 0;

        // Starting attributes
        this.name = name;
        this.mana = maxMana;     
        this.health = maxHealth;
        this.attacks = [new Punch(), ...spells];
    }

    loseMana(amount) {
        this.mana = clamp(this.maxMana, this.minMana, this.mana - amount);
    }

    loseHealth(amount) {
        this.health = clamp(this.maxHealth, this.minHealth, this.health - amount);
    }

    attack(spellcaster) {
        const usableAttacks = this.attacks.filter(attack => 
            (isAttackSpell(attack))
            ? ((this.mana - attack.manaConsumption) >= this.minMana) 
            : true
        );

        const randomAttackIdx = getRandomInt(0, usableAttacks.length);
        const attackToUse = usableAttacks[randomAttackIdx]; 
        
        spellcaster.loseHealth(attackToUse.damage);
        this.loseMana(isAttackSpell(attackToUse) ? attackToUse.manaConsumption : 0);

        console.log(`${this.name} attacked ${spellcaster.name} with ${attackToUse.name}`);
        console.log(`${spellcaster.name} received ${attackToUse.damage} damage`);

        console.log(`${this.name} has ${this.health}/${this.maxHealth} health points left.`);
        console.log(`${this.name} has ${this.mana}/${this.maxMana} mana points left.`);

        console.log(`${spellcaster.name} has ${spellcaster.health}/${spellcaster.maxHealth} health points left.`);
        console.log(`${spellcaster.name} has ${spellcaster.mana}/${spellcaster.maxMana} mana points left.`);

        console.log('\n---\n');
    }
}

class Conjurer extends Spellcaster {
    constructor(name) {
        super(name, 100, 125, [new Fireball(), new WaterBall()]);
    }
}

class Wizard extends Spellcaster {
    constructor(name) {
        super(name, 110, 150, [new Fireball(), new WaterBall(), new WindShear(), new GravityPush()]);
    }
}

class Sorcerer extends Spellcaster {
    constructor(name) {
        super(name, 120, 175, [new Fireball(), new WaterBall(), new WindShear(), new GravityPush(), new EarthDragon()]);
    }
}

class Magus extends Spellcaster {
    constructor(name) {
        super(name, 130, 200, [new Fireball(), new WaterBall(), new WindShear(), new GravityPush(), new EarthDragon(), new FlamingPheonix()]);
    }
}

class Attack {
    constructor(name, damage) {
        this.name = name;
        this.damage = damage;
    }
}

class Punch extends Attack {
    constructor() {
        super('Punch', 10);
    }
}

class Spell extends Attack {
    constructor(name, damage, manaConsumption) {
        super(name, damage);
        this.manaConsumption = manaConsumption;
    }
}

class Fireball extends Spell {
    constructor() {
        super('Fireball', 25, 30);
    }
}

class WaterBall extends Spell {
    constructor() {
        super('Water Ball', 25, 30);
    }
}

class WindShear extends Spell {
    constructor() {
        super('Wind Shear', 35, 40);
    }
}

class GravityPush extends Spell {
    constructor() {
        super('Gravity Push', 35, 40);
    }
}

class EarthDragon extends Spell {
    constructor() {
        super('Earth Dragon', 50, 60);
    }
}

class FlamingPheonix extends Spell {
    constructor() {
        super('Flaming Pheonix', 50, 60);
    }
}

function main() {
    const spellcasters = [
        new Conjurer('Dango'), 
        new Wizard('Harry'),
        new Sorcerer('Morgan'),
        new Magus('Gandalf'),
    ];

    let spellcastersInPlay = [...spellcasters];
    let attackQueue = [];

    while (spellcastersInPlay.length > 1) {
        attackQueue = [...spellcastersInPlay];
        shuffle(attackQueue);

        while (attackQueue.length > 0 || spellcastersInPlay > 1) {
            const attacker = attackQueue.shift();
            
            const allowedReceivers = spellcastersInPlay.filter(spellcaster => spellcaster !== attacker);
            const receiver = allowedReceivers[getRandomInt(0, allowedReceivers.length)];

            attacker.attack(receiver);

            if (receiver.health <= receiver.minHealth) {
                console.log(`(${receiver.name} has died.)`);
                spellcastersInPlay = spellcastersInPlay.filter(spellcaster => spellcaster !== receiver);
                break;
            } 
        }
    }

    console.log(`${spellcastersInPlay[0].name} has won!`);
}

main();