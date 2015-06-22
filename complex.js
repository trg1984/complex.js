/* Complex.js
 * 
 * A complex number class for Javascript.
 * 
 * Copyright 2013--2015 Rolf Lindén (rolind@utu.fi). All rights reserved.
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
	if (x instanceof Math.Complex) {
		this.x = x.x;
		this.y = x.y;
	} else {
		this.x = x;
		this.y = typeof(y) === 'number' ? y : 0;
	}
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

Math.Complex.prototype.isImaginary = function() { return ( this.precision(Math.Complex.prototype.mepsExp).y !== 0 ); }

Math.Complex.prototype.isPurelyImaginary = function() { return ( this.precision(Math.Complex.prototype.mepsExp).x === 0 ); }

Math.Complex.prototype.conjugate = function() { return ( new Math.Complex(this.x, -this.y) ); }

Math.Complex.prototype.neg = function() { return ( new Math.Complex(-this.x, -this.y) ); }

Math.Complex.prototype.inv = function() { return ( (new Math.Complex(1, 0)).div(this) ); }

Math.Complex.prototype.add = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return ( new Math.Complex(this.x + temp.x, this.y + temp.y) );
}

Math.Complex.prototype.sub = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return ( new Math.Complex(this.x - temp.x, this.y - temp.y) );
}

Math.Complex.prototype.mul = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return ( new Math.Complex(this.x * temp.x - this.y * temp.y, this.x * temp.y + this.y * temp.x) );
}

Math.Complex.prototype.div = function(a) {
    
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	
    var conj = temp.conjugate();
    var numerator = this.mul(conj);
    var denominator = temp.mul(conj);
    
    return ( new Math.Complex(numerator.x / denominator.x, numerator.y / denominator.x) );
}

Math.Complex.prototype.ln = function(k) {
	var mul = typeof(k) === 'number' ? k | 0 : (k instanceof Math.Complex) && (k.isReal()) ? k.x : 0;
	
	var r = this.modulus();
	var angle = this.arg();

	return new Math.Complex(Math.log(r), angle + 2 * mul * Math.PI);
}

Math.Complex.prototype.sin = function() {
	if (this.isReal()) {
		return (
			Math.Complex.div(
				Math.Complex.sub(
					Math.Complex.pow(Math.E, Math.Complex.I.mul(this.x)),
					Math.Complex.pow(Math.E, Math.Complex.I.mul(-this.x))
				),
				Math.Complex.I.mul(2)
			)
		);
	} else {
		return (
			Math.Complex.add(
				Math.Complex.mul(
					Math.Complex.sin(this.x),
					Math.Complex.cosh(this.y)
				),
				Math.Complex.mul(
					Math.Complex.cos(this.x),
					Math.Complex.sinh(this.y)
				)
			)
		);
	}
}

Math.Complex.prototype.cos = function() {
	if (this.isReal()) {
		return (
			Math.Complex.div(
				Math.Complex.add(
					Math.Complex.pow(Math.E, Math.Complex.I.mul(this.x)),
					Math.Complex.pow(Math.E, Math.Complex.I.mul(-this.x))
				),
				Math.Complex.I.mul(2)
			)
		);
	} else {
		return (
			Math.Complex.sub(
				Math.Complex.mul(
					Math.Complex.cos(this.x),
					Math.Complex.cosh(this.y)
				),
				Math.Complex.mul(
					Math.Complex.sin(this.x),
					Math.Complex.sinh(this.y)
				)
			)
		);
	}
}

Math.Complex.prototype.tan = function() {
	return (
		Math.Complex.div(
			this.sin(),
			this.cos()
		)
	);
}

Math.Complex.prototype.cot = function() {
	return (
		Math.Complex.div(
			this.cos(),
			this.sin()
		)
	);
}

Math.Complex.prototype.sec = function() {
	return (
		Math.Complex.div(
			1,
			this.cos()
		)
	);
}

Math.Complex.prototype.csc = function() {
	return (
		Math.Complex.div(
			1,
			this.sin()
		)
	);
}

Math.Complex.prototype.zhukovskii = function() {
	return (
		Math.Complex.mul(
			1/2,
			this.add(this.inv())
		)
	);
}

Math.Complex.prototype.tanh = function() {
	return (
		Math.Complex.div(
			Math.Complex.sinh(this),
			Math.Complex.cosh(this)
		)
	);
}

Math.Complex.prototype.coth = function() {
	return (
		Math.Complex.div(
			Math.Complex.cosh(this),
			Math.Complex.sinh(this)
		)
	);
}

Math.Complex.prototype.sech = function() {
	return (
		Math.Complex.div(
			1,
			Math.Complex.cosh(this)
		)
	);
}

Math.Complex.prototype.csch = function() {
	return (
		Math.Complex.div(
			1,
			Math.Complex.sinh(this)
		)
	);
}

Math.Complex.prototype.sinh = function() {
	return (
		Math.Complex.div(
			Math.Complex.sub(
				Math.Complex.pow(Math.E, this),
				Math.Complex.pow(Math.E, this.neg())
			),
			2
		)
	);
}

Math.Complex.prototype.cosh = function() {
	return (
		Math.Complex.div(
			Math.Complex.add(
				Math.Complex.pow(Math.E, this),
				Math.Complex.pow(Math.E, this.neg())
			),
			2
		)
	);
}

Math.Complex.prototype.arcsinh = function() {
	return (
		Math.Complex.ln(
			this.add(
				Math.Complex.pow(
					this.mul(this).add(1),
					1 / 2
				)
			)
		)
	);
}

Math.Complex.prototype.arccosh = function() {
	return (
		Math.Complex.ln(
			this
				.add(Math.Complex.pow(this.add(1), 1 / 2))
				.add(Math.Complex.pow(this.sub(1), 1 / 2))
		)
	);
}

Math.Complex.prototype.arctanh = function() {
	return (
		Math.Complex.mul(
			1 / 2,
			Math.Complex.sub(
				Math.Complex.ln(Math.Complex.add(1, this)),
				Math.Complex.ln(Math.Complex.sub(1, this))
			)
		)
	);
}

Math.Complex.prototype.arccoth = function() {
	return (
		Math.Complex.mul(
			1 / 2,
			Math.Complex.sub(
				Math.Complex.ln(Math.Complex.add(1, this.inv())),
				Math.Complex.ln(Math.Complex.sub(1, this.inv()))
			)
		)
	);
}

Math.Complex.prototype.arccsch = function() {
	// ln(sqrt(1+1/(z^2)) + 1/z)
	return (
		Math.Complex.ln(
			Math.Complex.pow(
				Math.Complex.add(
					1,
					Math.Complex.div(1, this.mul(this))
				),
				1/2
			)
			.add(this.inv())
		)
	);
}


Math.Complex.prototype.arcsech = function() {
	// ln(1/z+sqrt(1/z-1)*sqrt(1/z+1))
	return (
		Math.Complex.ln(
			this.inv().add(
				Math.Complex.mul(
					Math.Complex.pow(
						this.inv().sub(1),
						1/2
					),
					Math.Complex.pow(
						this.inv().add(1),
						1/2
					)
				)
			)
		)
	);
}

Math.Complex.prototype.arcsin = function() {
	// arcsin(z) = -i ln(iz +sqrt(1-z^2))
	return (
		Math.Complex.mul(
			Math.Complex.I.neg(),
			Math.Complex.ln(
				Math.Complex.add(
					Math.Complex.I.mul(this),
					Math.pow(this.mul(this).neg().add(1), 1 / 2)
				)
			)
		)
	);
}

Math.Complex.prototype.arccos = function() {
	// arccos(z) = -i ln(z +sqrt(z^2 - 1))
	return (
		Math.Complex.mul(
			Math.Complex.I.neg(),
			Math.Complex.ln(
				Math.Complex.add(
					this,
					Math.pow(this.mul(this).sub(1), 1 / 2)
				)
			)
		)
	);
}

Math.Complex.prototype.arctan = function() {
	// arctan(z) = i/2*(ln(1 - iz) - ln(1 + iz))
	return (
		Math.Complex.sub(
			Math.Complex.mul(
				Math.Complex.I.div(2),
				Math.Complex.sub(
					Math.Complex.ln(Math.Complex.sub(1, Math.Complex.I.mul(this))),
					Math.Complex.ln(Math.Complex.add(1, Math.Complex.I.mul(this)))
				)
			)
		)
	);
}

Math.Complex.prototype.arccot = function() {
	// arccot(z) = i/2*(ln(1 - i/z) - ln(1 + i/z))
	return (
		Math.Complex.sub(
			Math.Complex.mul(
				Math.Complex.I.div(2),
				Math.Complex.sub(
					Math.Complex.ln(Math.Complex.sub(1, Math.Complex.I.div(this))),
					Math.Complex.ln(Math.Complex.add(1, Math.Complex.I.div(this)))
				)
			)
		)
	);
}

Math.Complex.prototype.arccsc = function() {
	// arccsc(z) = -i ln(sqrt( 1-1/(z^2) ) + i/z)
	return (
		Math.Complex.mul(
			Math.Complex.I.neg(),
			Math.Complex.ln(
				Math.Complex.add(
					Math.pow(
						Math.Complex.sub(1, (new Math.Complex(1)).div(this.mul(this))),
						1 / 2
					),
					Math.Complex.I.div(this)
				)
			)
		)
	);
}

Math.Complex.prototype.arcsec = function() {
	// arcsec(z) = -i ln(sqrt( 1/(z^2) - 1 ) + i/z)
	return (
		Math.Complex.mul(
			Math.Complex.I.neg(),
			Math.Complex.ln(
				Math.Complex.add(
					Math.pow(
						Math.Complex.sub((new Math.Complex(1)).div(this.mul(this)), 1),
						1 / 2
					),
					Math.Complex.I.div(this)
				)
			)
		)
	);
}

Math.Complex.prototype.gamma = function() {
	
	//     \Gamma(1-z) * \Gamma(z) = {\pi \over \sin \pi z}
	// <=> \Gamma(z) = \frac{\pi}{\sin \pi z \Gamma(1-z) }
	
	if (this.Re() < 0.5) return (
		Math.Complex.div(
			Math.PI,
			Math.Complex.sin(this.mul(Math.PI))
			.mul(
				Math.Complex.gamma(
					Math.Complex.sub(1, this)
				)
			)
		)
	);
	
	// else
	
	var g = 7;
	var p = [
		676.5203681218851,
		-1259.1392167224028,
		771.32342877765313,
		-176.61502916214059,
		12.507343278686905,
		-0.13857109526572012,
		9.9843695780195716e-6,
		1.5056327351493116e-7
	];

	//A_g(z) = \frac{1}{2}p_0(g) + p_1(g) \frac{z}{z+1} + p_2(g) \frac{z(z-1)}{(z+1)(z+2)} + \cdots. 
	var __Ag = function(zVal) {
		var result = new Math.Complex(0.99999999999980993);
		for (var k = 0; k < p.length; ++k) {
			result = result.add( Math.Complex.div( p[k], zVal.add(k + 1) ) );
		}
		
		return result;
	}

	//\Gamma(z) = \sqrt{2\pi} {\left( z + g - \frac{1}{2} \right)}^{z - \frac{1}{2} } e^{-\left(z+g-\frac{1}{2}\right)} A_g(z - 1)
	
	//gamma(z) =
	var ans = Math.Complex.pow(
			2 * Math.PI,
			1 / 2
		).mul(
			Math.Complex.pow(
				this.add(g).sub(1 / 2),
				this.sub(1 / 2)
			)
		).mul(
			Math.Complex.pow(
				Math.E,
				Math.Complex.neg(this.add(g).sub(1 / 2))
			)
		).mul( __Ag(this.sub(1)) );
		return ( this.isReal() && (this.x > 0) && (this.x === (Math.round(this.x))) ? new Math.Complex(Math.round(ans.x)) : ans );
}

Math.Complex.prototype.pow = function(power) {
    
    var r = this.modulus();
    var angle = this.arg();
	var pwr = power instanceof Math.Complex ? power : new Math.Complex(power);
	var scalar = Math.pow(r, pwr.x) * Math.pow(Math.E, -pwr.y * angle);
	var inner = angle * pwr.x + 0.5 * pwr.y * Math.log(Math.pow(r, 2));
	
	return(
		(new Math.Complex(
			scalar * Math.cos(inner),
			scalar * Math.sin(inner)
		))
	);
}

Math.Complex.prototype.toString = function() {
	if (Number.isNaN(this.x) || Number.isNaN(this.y)) return 'NaN';
	if (this.modulus() == 0) return '0';
	var realPortion = this.isPurelyImaginary() ? '' : this.x;
	var imaginaryPortion = this.isReal() ? '' : this.y == 1 ? 'i' : this.y == -1 ? '-i' : this.y + 'i';
	return ( realPortion + ((this.y > 0) && (realPortion !== '') && (imaginaryPortion !== '') ? '+' : '') + imaginaryPortion );
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

// Added for convinience.
Math.Complex.I = new Math.Complex(0, 1);

Math.Complex.add = function(a, b) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.add(b)
}

Math.Complex.sub = function(a, b) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.sub(b)
}

Math.Complex.mul = function(a, b) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.mul(b)
}

Math.Complex.div = function(a, b) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.div(b)
}

Math.Complex.neg = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.neg()
}

Math.Complex.inv = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.inv(b)
}

Math.Complex.sin = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.sin()
}

Math.Complex.cos = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.cos()
}

Math.Complex.tan = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.tan()
}

Math.Complex.cot = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.cot()
}

Math.Complex.sec = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.sec()
}

Math.Complex.csc = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.csc()
}

Math.Complex.arcsin = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.arcsin()
}

Math.Complex.arccos = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.arccos()
}

Math.Complex.arctan = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.arctan()
}

Math.Complex.arccot = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.arccot()
}

Math.Complex.arccsc = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.arccsc()
}

Math.Complex.arcsec = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.arcsec()
}

Math.Complex.sinh = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.sinh()
}

Math.Complex.cosh = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.cosh()
}

Math.Complex.tanh = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.tanh()
}

Math.Complex.coth = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.coth()
}

Math.Complex.sech = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.sech()
}

Math.Complex.csch = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.csch()
}

Math.Complex.arcsinh = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.arcsinh()
}

Math.Complex.arccosh = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.arccosh()
}

Math.Complex.arctanh = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.arctanh()
}

Math.Complex.arccoth = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.arccoth()
}

Math.Complex.arccsch = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.arccsch()
}

Math.Complex.arcsech = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.arcsech()
}

Math.Complex.ln = function(a, k) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.ln(k)
}

Math.Complex.gamma = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.gamma()
}

Math.Complex.pow = function(a, exponent) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.pow(exponent)
}

Math.Complex.conjugate = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.conjugate()
}

Math.Complex.arg = function(a) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.arg()
}

Math.Complex.add = function(a, b) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.add(b)
}

Math.Complex.nthRoots = function(a, n, onlyRealRoots) {
	var temp = a instanceof Math.Complex ? a : new Math.Complex(a);
	return temp.nthRoots(n, onlyRealRoots)
}
