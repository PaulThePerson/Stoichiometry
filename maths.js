var atoms = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'];
var weights = [1.008, 4.002, 6.941, 9.012, 10.814, 12.011, 14.007, 15.999, 18.998, 20.179, 22.989, 24.305, 26.981, 28.085, 30.973, 32.060, 35.450, 39.948, 39.098, 40.078, 44.955, 47.867, 50.941, 51.996, 54.938, 55.845, 58.933, 58.693, 63.546, 65.380, 69.723, 72.630, 74.921, 78.971, 79.904, 83.798, 85.468, 87.620, 88.905, 91.224, 92.906, 95.950, 98, 101.070, 102.906, 106.420, 107.868, 112.414, 114.818, 118.710, 121.760, 127.600, 126.90447, 131.293, 132.90545196, 137.327, 138.90547, 140.116, 140.90766, 144.242, 145, 150.36, 151.964, 157.25, 158.92535, 162.500, 164.93033, 167.259, 168.93422, 173.045, 174.9668, 178.49, 180.94788, 183.84, 186.207, 190.23, 192.217, 195.084, 196.966569, 200.592, 204.38, 207.2, 208.98040, 209, 210, 222, 223, 226, 227, 232.0377, 231.03588, 238.02891, 237, 244, 243, 247, 247, 251, 252, 257, 258, 259, 266, 267, 268, 269, 270, 277, 278, 281, 282, 285, 286, 289, 290, 293, 294, 294];

var cur="";

var fat="";
  //Matrix Datastructure
  //0 - Molecule Name
  //1 - Molecule Atomic weight
  //2 - Weight in Equation
  //3 - Variable weight (0)
  //4 - Component and Commonality
  //5 - User Typed Value
  //6 - Before or after Equals sign
  //7 - 0 - Nothing, 1 - Current limiting Reagent, 2 - Unlimiting reagent


function fixReturn(thing) {
  var sum = 0;
  if (thing === null) {
    return 0;
  }
  thing.forEach(function(x) {
    if (x === "") {
      sum += 1;
    } else {
      sum += parseInt(x);
    }
  });
  return sum;
}

function basicWeight(molecule) {
  var parts=molecule.match(/[A-Z][a-z]?[0-9]*/gm);
  var sum=0;
  parts.forEach(function (atom){
    sum += weights[atoms.indexOf(atom.match(/[A-Z][a-z]?/)[0])]*fixReturn([atom.match(/[A-Z][a-z]?(.*)/)[1]]);
  })
  return sum;
}

function split(molecule){
  //console.log(molecule);
  var un = molecule.match(/[(][^)]+[)][0-9]*|[A-Z][a-z]?[0-9]*/gm), parts=[], weight=0;
  //console.log(un);
  un.forEach(function (part){
    var thing = part.match(/(.*[^0-9])([0-9]*)$/);
    weight+=basicWeight(thing[1].match(/[^()]+/)[0])*fixReturn([thing[2]]);
    for(var i =0; i<parts.length; i++){
      if(parts[i][0] === thing[1]){
        parts[i][1]+=fixReturn([thing[2]]);
        return ;
      }
    }
    parts.push([thing[1],fixReturn([thing[2]])]);
  })
  return [weight,parts];
}

function assembleMatrix(equation){
  var matrix=[equation.match(/[+=][^=+]+/g),[],[],[],[],[],[],[]];
  var before=1;
  console.log(matrix);
  for(var i = 0; i<matrix[0].length; i++){
    matrix[1].push(split(matrix[0][i].match(/[A-Z].*/)[0])[0]);
    matrix[2].push(matrix[1][i]*fixReturn([matrix[0][i].match(/[+=]([0-9]*)/)[1]]));
    matrix[3].push(0);
    matrix[4].push(split(matrix[0][i].match(/[A-Z].*/)[0])[1]);
    matrix[5].push(0);
    if(matrix[0][i][0]==="="){
      before=-1;
    }
    matrix[6].push(before);
    matrix[7].push(0)
    console.log(matrix);
  }
  fat=matrix;
}

function makeTable(matrix){
  var thing = document.getElementById("table");
  while (thing.children.length > 1) {
    thing.removeChild(thing.lastChild);
  }
  for (var i = 0; i < matrix[0].length; i++) {
    var box = document.createElement("div");

    var a = document.createElement("p");
    a.innerHTML = matrix[0][i]
    box.appendChild(a);

    var b = document.createElement("p");
    b.innerHTML = parseInt(matrix[1][i] * 1000) / 1000;
    box.appendChild(b);

    var c = document.createElement("input");
    c.placeholder = matrix[2][i];
    c.setAttribute("id", "input" + String(i));
    c.setAttribute("onKeyUp", "comp("+String(i)+")");
    box.appendChild(c);

    thing.appendChild(box);
  }
}

function change(){
  equation="+"+document.getElementById('in').value;
  assembleMatrix(equation);
  makeTable(fat);
}

function comp(x){
  v=document.getElementById("input"+x).value;
  for(var i=0; i<fat[0].length; i++){
    fat[5][i]=0
  }
  fat[5][x]=parseFloat(v);
  scale=v/fat[2][x];
  for(var i=0; i<fat[0].length; i++){
    fat[3][i]=fat[2][i]*scale;
    document.getElementById('input'+i).placeholder=parseInt(fat[3][i]*1000)/1000;
  }
  console.log(fat);
}
