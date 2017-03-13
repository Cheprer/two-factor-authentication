let people = {
    'john@be.org': {
        name: 'John Be',
        email: 'john@be.org',
        password: '$2a$12$cNItD/H8mVIQgaMZNhqqSuXCOamCOTbT6RlQ2IV9gx3MpcF/0mZma',
        password_validated: false,
        two_factor_enabled: true,
        two_factor_secret: "KVZD423ULAVDMJTPFJJUG2B4MNJFW3TY"
    },
    'simple@be.org': {
        name: 'Simple Be',
        email: 'simple@be.org',
        password: '$2a$12$09BsWu.TlMLj32ETQdgBUOQ53pTNn1Htp4AtteBbBTM7D/V6rz3hi',
        password_validated: false,
        two_factor_enabled: false,
        two_factor_secret: null
    }
};

let sessions = {
    'example': {
        sid: 'example',
        exp: '1488747414',
        email: 'simple@be.org'
    }
};

module.exports = {
    people : people,
    sessions : sessions
};
