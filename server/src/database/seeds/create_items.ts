import Knex from 'knex';

export async function seed(knex : Knex) {
    return await knex('items').insert([
        { title: 'Lampadas', image: 'lampadas.svg' },
        { title: 'Pilhas e Baterias', image: 'baterias.svg' },
        { title: 'Papeis e Papelao', image: 'papeis-papelao.svg' },
        { title: 'Residuos Eletronicos', image: 'eletronicos.svg' },
        { title: 'Residues Organicos', image: 'organicos.svg' },
        { title: 'Oleo de Cozinha', image: 'oleo.svg' },
    ]);
}