'use strict';

// libraries
const chai = require('chai');

// modules
const expect = chai.expect;

const signUtil = require('../../scripts/tx-sign.js');

const hashUtil = require('../../scripts/sha256-hash.js');

// functions
describe('ledger-hash', () => {
  it('test 1', () => {
    const encodedTx = '022844414734457162664a4e53595a444466733741557a6f666f744a7a5a58655259674861475a366a512844414734386e6d7867704b685a7a457a7963383679396f486f7478784735374738734242776a35360405f5e10040303865366630633364363565643062333933363034666665323832333734626635303139353662613434376263316335616334396263643265386363343466640202370301e2400866498342c91b1383';
    const expectedHash = '8987E92A61B7E38E82361CCAA62772801654AFA20065C2A5A6D873FE23CCCC49';
    const publicKey = '0408DDA015C42EA066A52D68E2AB2985B5AB255D3D0FD2B90363548CC74963B156E1A6AEC5BEB1A0C1DF86025FFDED1DBA91AFA87ECACDC6E32934421AB6C28D9E';
    const signature = '3045022100D18069B0C5AB86519ABC34769DAE95B5D47F0ABCBFB656077186151DE350ED39022049165BB33F889E44D5B21DB7B6DA7B33D25B6B36EA4FEE15BACD54AF7CE814F2';

    const actualHash = hashUtil.sha256Hash(encodedTx).toString('hex').toUpperCase();
    expect(actualHash).to.deep.equal(expectedHash);
    const expectedVerifyResponse = {
      signature: signature,
      verified: true,
    };
    const verifyResponse = signUtil.verify(Buffer.from(expectedHash, 'hex'), signature, publicKey);
    const actualVerifyResponse = {
      signature: signature,
      verified: verifyResponse,
    };
    expect(actualVerifyResponse).to.deep.equal(expectedVerifyResponse);
  });
  it('test 2', () => {
    const encodedTx = '022844414734457162664a4e53595a444466733741557a6f666f744a7a5a58655259674861475a366a512844414736785872763637724c4161476f5943615565327070424a4d4b73726955694e567a6b4a76760101403233323435646363386662333131373964653435373235336634363432383334393336323165643831396332353231623737613364633337393262393435343502024601010100';
    const expectedHash = 'a3e2f841b557df78ccb95395e2f6d3dd488895e5533d1b16cc2e4063ec0b3dd2';
    const publicKey = '0408DDA015C42EA066A52D68E2AB2985B5AB255D3D0FD2B90363548CC74963B156E1A6AEC5BEB1A0C1DF86025FFDED1DBA91AFA87ECACDC6E32934421AB6C28D9E';
    const signature = '304402205520FD32B3C1D6D9FEA40A0D2084CC0FCDB0FE323C3958F045A7235F83B2F7EB02205776B4C5114C8A408DF66A57D341F7FAFFB2702D4E5A23E9A2AF84A519EB87B2';

    const actualHash = hashUtil.sha256Hash(Buffer.from(encodedTx)).toString('hex');
    expect(actualHash).to.deep.equal(expectedHash);

    const expectedVerifyResponse = {
      signature: signature,
      verified: true,
    };
    const verifyResponse = signUtil.verify(Buffer.from(expectedHash, 'hex'), signature, publicKey);
    const actualVerifyResponse = {
      signature: signature,
      verified: verifyResponse,
    };
    expect(actualVerifyResponse).to.deep.equal(expectedVerifyResponse);
  });
  it('test 3', () => {
    const encodedTx = '022844414734457162664a4e53595a444466733741557a6f666f744a7a5a58655259674861475a366a512844414736785872763637724c4161476f5943615565327070424a4d4b73726955694e567a6b4a76760101403137656338313737666333313737366437346233616537333065623333633235623732613766616630633839313230383738326564643464323339346234616602024d01000100';
    const expectedHash = 'b236da5a8fa34c98367f8385733463f52b0f47fc8f874f13d8c41b55d486bfeb';
    const publicKey = '0408DDA015C42EA066A52D68E2AB2985B5AB255D3D0FD2B90363548CC74963B156E1A6AEC5BEB1A0C1DF86025FFDED1DBA91AFA87ECACDC6E32934421AB6C28D9E';
    const signature = '304402205520FD32B3C1D6D9FEA40A0D2084CC0FCDB0FE323C3958F045A7235F83B2F7EB0220245269C14581AE8354BBB1D9BA6CAF8450FFF852E617984CF504546AC3F8E4FC';

    const actualHash = hashUtil.sha256Hash(Buffer.from(encodedTx)).toString('hex');
    expect(actualHash).to.deep.equal(expectedHash);

    const expectedVerifyResponse = {
      signature: signature,
      verified: true,
    };
    const verifyResponse = signUtil.verify(expectedHash.toString('hex'), signature, publicKey);
    const actualVerifyResponse = {
      signature: signature,
      verified: verifyResponse,
    };
    expect(actualVerifyResponse).to.deep.equal(expectedVerifyResponse);
  });

  beforeEach(async () => {});

  afterEach(async () => {});
});
