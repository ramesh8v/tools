const alpha = 3.656;
const beta = 1.089;
const z_table = {'-3.4':0.003, "-3.3":0.005, "-3.2":0.007, "-3.1":0.0010,
                 "-3.0": 0.0013, "-2.9":0.0019, "-2.8":0.0026, "-2.7":0.0035, "-2.6":0.0047,
                 "-2.5":0.0062, "-2.4":0.0082, "-2.3":0.0107, "-2.2": 0.139, "-2.1":0.0179,
                 "-2.0":0.0228, "-1.9":0.0287, "-1.8":0.0359, "-1.7":0.0446, "-1.6":0.0548,
                 "-1.5":0.0668, "-1.4":0.0808, "-1.3":0.0968, "-1.2":0.1151, "-1.1":0.1357,
                 "-1.0":0.1587, "-0.9":0.1841, "-0.8":0.2119, "-0.7":0.2420, "-0.6":0.2743,
                 "-0.5":0.3085 ,"0.4":0.3446, "0.3":0.3821, "0.2":0.4207, "0.1":0.4602,
                 "0.0":0.5000
                    };
function computepval(){
    console.log("running");
    let irr = document.getElementById("irr").value;
    let srr = document.getElementById("srr").value;
    let ipos = document.getElementById("ipos").value;
    let spos = document.getElementById("spos").value;
    console.log("values", irr, srr,ipos, spos);
    let rr = ((parseFloat(irr)/1000000) + (parseFloat(srr)/1000000))/2;
    let sigma = Math.pow(10,(alpha+beta*rr));
    let dif = Math.abs(parseFloat(ipos)-parseFloat(spos));
    let phi_func = dif/Math.sqrt(2*sigma);
    console.log("Phi value", rr, sigma, dif, phi_func);
    let pval = 2*(1-zscorecal(phi_func));
    document.getElementById("pval").innerHTML = pval;
    console.log("P value", pval);
}