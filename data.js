const malla = [
  {
    anio: 1,
    semestres: [
      {
        semestre: 1,
        ramos: [
          { codigo: "DQUI1045", nombre: "Química General I", sct: 8, prereqs: [] },
          { codigo: "DBIO1091", nombre: "Biología Celular", sct: 5, prereqs: [] },
          { codigo: "DCEX0002", nombre: "Matemática", sct: 7, prereqs: [] },
          { codigo: "QYFAA001", nombre: "Introducción a las ciencias farmacéuticas", sct: 4, prereqs: [] },
          { codigo: "QYFAA002", nombre: "Integrado de habilidades científicas para el químico farmacéutico", sct: 3, prereqs: [] },
          { codigo: "FORI0001", nombre: "Antropología", sct: 3, prereqs: [] }
        ]
      },
      {
        semestre: 2,
        ramos: [
          { codigo: "DQUI1046", nombre: "Química General II", sct: 8, prereqs: ["DQUI1045"] },
          { codigo: "DCEX0003", nombre: "Cálculo diferencial", sct: 5, prereqs: ["DCEX0002"] },
          { codigo: "DCEX0019", nombre: "Física", sct: 5, prereqs: ["DCEX0002"] },
          { codigo: "DCEX0005", nombre: "Bioestadística", sct: 5, prereqs: ["DCEX0002"] },
          { codigo: "QYFAB001", nombre: "Fundamentos del quehacer farmacéutico", sct: 4, prereqs: ["QYFAA001"] },
          { codigo: "FORI0002", nombre: "Ética", sct: 3, prereqs: ["FORI0001"] }
        ]
      }
    ]
  },
  {
    anio: 2,
    semestres: [
      {
        semestre: 3,
        ramos: [
          { codigo: "DQUI1047", nombre: "Química analítica cualicuantitativa", sct: 6, prereqs: ["DQUI1046"] },
          { codigo: "DQUI1052", nombre: "Química orgánica", sct: 5, prereqs: ["DQUI1045"] },
          { codigo: "DQUI1053", nombre: "Fisicoquímica", sct: 6, prereqs: ["DQUI1046"] },
          { codigo: "DBIO1085", nombre: "Fisiología integrada", sct: 5, prereqs: ["DBIO1091"] },
          { codigo: "DSPU0012", nombre: "Salud poblacional", sct: 4, prereqs: [] },
          { codigo: "ELECDGEE01", nombre: "Gestión personal y habilidades para la vida", sct: 4, prereqs: [] }
        ]
      },
      {
        semestre: 4,
        ramos: [
          { codigo: "DQUI1054", nombre: "Análisis químico instrumental", sct: 6, prereqs: ["DQUI1047"] },
          { codigo: "DQUI1055", nombre: "Química orgánica avanzada", sct: 5, prereqs: ["DQUI1052"] },
          { codigo: "DBIO1094", nombre: "Bioquímica general", sct: 6, prereqs: ["DQUI1052"] },
          { codigo: "DMOR0019", nombre: "Fisiopatología", sct: 5, prereqs: ["DBIO1085"] },
          { codigo: "DSPU0014", nombre: "Epidemiología", sct: 6, prereqs: ["DSPU0012"] },
          { codigo: "QYFAD001", nombre: "Hito evaluativo integrativo", sct: 4, prereqs: ["DQUI1046", "DQUI1047", "DQUI1052", "DBIO1085"] }
        ]
      }
    ]
  },
  {
    anio: 3,
    semestres: [
      {
        semestre: 5,
        ramos: [
          { codigo: "DBIO1087", nombre: "Farmacología I", sct: 7, prereqs: ["DMOR0019"] },
          { codigo: "QYFAE001", nombre: "Tecnología farmacéutica I", sct: 6, prereqs: ["DQUI1053"] },
          { codigo: "QYFAE002", nombre: "Química farmacéutica I", sct: 5, prereqs: ["DQUI1055"] },
          { codigo: "DBIO1095", nombre: "Microbiología general", sct: 6, prereqs: ["DBIO1094"] },
          { codigo: "FACU0004", nombre: "Salud digital", sct: 3, prereqs: [] },
          { codigo: "FORI0003", nombre: "Persona y sociedad", sct: 3, prereqs: ["FORI0002"] }
        ]
      },
      {
        semestre: 6,
        ramos: [
          { codigo: "DBIO1096", nombre: "Farmacología II", sct: 7, prereqs: ["DBIO1087"] },
          { codigo: "QYFAF001", nombre: "Tecnología farmacéutica II", sct: 6, prereqs: ["QYFAE001"] },
          { codigo: "QYFAF002", nombre: "Química farmacéutica II", sct: 6, prereqs: ["QYFAE002"] },
          { codigo: "DEBI0002", nombre: "Bioética", sct: 3, prereqs: [] },
          { codigo: "QYFAF003", nombre: "Práctica I: Rol del químico farmacéutico", sct: 5, prereqs: ["DBIO1096"] },
          { codigo: "ELECFORI01", nombre: "Electivo I: formación integral", sct: 3, prereqs: [] }
        ]
      }
    ]
  }
];
