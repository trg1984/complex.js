/* Complex.js
 * 
 * A complex number class for Javascript.
 * 
 * Copyright 2013 Rolf Lindén (rolind@utu.fi). All rights reserved.
 * 
 * Free to use, modify and distribute for no cost, as long as this
 * disclaimer remains in its place and unmodified (no changes,
 * removals or addions are allowed to this disclaimer) and all
 * modifications to this library will be sent back to me, so I can
 * maintain a single codebase for everyone.
 * 
 * This library may be distributed as a part of commercial product
 * as long as the above conditions are met.
 * 
 * -Rolf
 */

Math.Complex = function(x, y) {
    this.x = x;
    this.y = y ? y : 0;
}

Math.Complex.prototype.meps = 1e-7;

Math.Complex.prototype.mepsExp = Math.log(Math.Complex.prototype.meps) / Math.log(10);

Math.Complex.prototype.precision = function(n) {
    var prec;
    switch(n) { // The usual suspects.
        case -8: prec = 1e-8; break;
        case -7: prec = 1e-7; break;
        case -6: prec = 1e-6; break;
        case -5: prec = 1e-5; break;
        case -4: prec = 1e-4; break;
        case -3: prec = 1e-3; break;
        case -2: prec = 1e-2; break;
        case -1: prec = 1e-1; break;
        case  0: prec = 1e+0; break;
        case  1: prec = 1e+1; break;
        case  2: prec = 1e+2; break;
        case  3: prec = 1e+3; break;
        case  4: prec = 1e+4; break;
        case  5: prec = 1e+5; break;
        case  6: prec = 1e+6; break;
        case  7: prec = 1e+7; break;
        case  8: prec = 1e+8; break;
        default: prec = Number("1e" + n);
    }
    
    // I know there exists a toPrecision() function, but this works for large numbers too.
    return (new Math.Complex( Math.round(this.x / prec) * prec, Math.round(this.y / prec) * prec) );
}

Math.Complex.prototype.Re = function() { return (this.x); }

Math.Complex.prototype.Im = function() { return (this.y); }

Math.Complex.prototype.arg = function() { return ( Math.atan2(this.y, this.x) ); }

Math.Complex.prototype.modulus = function() { return ( Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)) ); }

Math.Complex.prototype.isReal = function() { return ( this.precision(Math.Complex.prototype.mepsExp).y === 0 ); }

Math.Complex.prototype.conjugate = function() { return ( new Math.Complex(this.x, -this.y) ); }

Math.Complex.prototype.add = function(a) { return ( new Math.Complex(this.x + a.x, this.y + a.y) ); }

Math.Complex.prototype.sub = function(a) { return ( new Math.Complex(this.x - a.x, this.y - a.y) ); }

Math.Complex.prototype.mul = function(a) { return ( new Math.Complex(this.x * a.x - this.y * a.y, this.x * a.y + this.y * a.x) ); }

Math.Complex.prototype.div = function(a) {
    
    var conj = a.conjugate();
    var numerator = this.mul(conj);
    var denominator = a.mul(conj);
    
    return ( new Math.Complex(numerator.x / denominator.x, numerator.y / denominator.x) );
}

Math.Complex.prototype.pow = function(power) {
    
    var r = this.modulus();
    var angle = this.arg();
    
    return(
        (new Math.Complex(
            Math.pow(r, power) * Math.cos( angle * power ),
            Math.pow(r, power) * Math.sin( angle * power )
        )).precision(Math.Complex.prototype.mepsExp)
    );
}

Math.Complex.prototype.toString = function() {
    if (this.x == 0) return ( this.y + 'ⅈ' );
    else if (this.y == 0) return ( this.x );
    else return ( this.x + (this.y >= 0 ? '+' : '') + this.y + 'ⅈ' );
}

Math.Complex.prototype.latex = function() {
    if (this.x == 0) return ( this.y + '\\imath' );
    else if (this.y == 0) return ( this.x );
    else return ( this.x + (this.y >= 0 ? '+' : '') + this.y + '\\imath' );
}

Math.Complex.prototype.nthRoots = function(n, onlyRealRoots) {
    var r = this.modulus();
    var angle = this.arg();

    var roots = [];
    for (var i = 0; i < n; ++i) {
        if (!onlyRealRoots || (onlyRealRoots && (Math.abs(Math.sin( (angle + i * 2 * Math.PI) / n )) < Math.Complex.prototype.meps))) {
            roots.push(
                (
                    new Math.Complex(
                        Math.pow(r, 1 / n) * Math.cos( (angle + i * 2 * Math.PI) / n ),
                        Math.pow(r, 1 / n) * Math.sin( (angle + i * 2 * Math.PI) / n )
                    )
                ).precision(Math.Complex.prototype.mepsExp) // Javascript sine function is not discriminative after 1e-7.
            );
        }
    }
    if (onlyRealRoots) roots.sort( function(a, b) { return(a.x - b.x); } ); // Sort real roots to ascending order. 
    
    return ( roots );
}
