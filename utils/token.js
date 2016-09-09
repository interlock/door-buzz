// Convert a JWT json file in to prefixed ENV style
var prefix = "G_";

var input = process.argv[2];

var j = require(input);

for(var k in j) {
  let new_k = prefix + k.toUpperCase();
  let v = j[k].replace(/"/g,'\"').replace(/\n/g,'\\n');
  process.stdout.write(new_k + "=\"" + v +"\"\n");
}
