import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import './styles.css';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import { Map, TileLayer,Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';

import Dropzone from '../../components/Dropzone';

import api from '../../services/api';

import logo from '../../assets/logo.svg';
//import Modal from '../../components/Modal';

const Createpoint = () => {
    interface Item {
        id: number;
        title: string;
        image_url: string
    }

    interface IBGEUFResponse {
        sigla: string;
    }

    interface IBGECityResponse {
        nome: string;
    }
    
    const histoty = useHistory();

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    
    const [selectedUf, setSelectedUf] = useState<string>('0');
    const [selectdedCity, setSelectedCity] = useState<string>('0');
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);

    const [itemSelected, setItemSelected] = useState<number[]>([]);

    const [selectedFile, setSelectedFile] = useState<File>();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp:''
    });

    //const [showModal, setShowModal] = useState(true);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {            
            const {latitude, longitude} = position.coords;
            
            setInitialPosition([latitude, longitude]);
        });
    }, []);

    useEffect(() => {
        api.get('items').then( response => {
            setItems(response.data);
           
            
        })
    }, []);

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
            .then(response => {
                
                const ufInitials = response.data.map(uf => uf.sigla);                
                setUfs(ufInitials);
            });
    }, []);

    useEffect(() => {
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/distritos?orderBy=nome`)
            .then(response => {
                const citiesResponse = response.data.map(city => city.nome);                
                setCities(citiesResponse);
            });
    }, [selectedUf]);

    function handleSelectUf(event : ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setSelectedUf(uf);
    }

    function handleSelectedCity(event : ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;
        setSelectedCity(city);
    }

    function handleSelectedPosition(event : LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
    }

    function handleSelectedItem( id : number) {
        const alreadySelected = itemSelected.findIndex(item => item === id);

        if(alreadySelected >= 0) {
            const filteredItems = itemSelected.filter(item => item !== id);

            setItemSelected(filteredItems);
        }else {
            setItemSelected([ ...itemSelected, id ]);
        }
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectdedCity;
        const [latitude, longitude] = selectedPosition;
        const items = itemSelected;

        const data = new FormData();
                 
        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('city', city);
        data.append('uf', uf);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(','));

        if(selectedFile) {
            data.append('image', selectedFile);
        }        

         await api.post('points', data);
         alert('deu sera?');
         histoty.push('/');

        //setShowModal(true);
    }

    return (
        <div id="page-create-point">
            
            <header>
                <img src={logo} alt="ecoleta"/>

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para Home
                </Link>
            </header>

            <form onSubmit={handleSubmit} >
                <h1>Cadastro do <br /> ponto de coleta.</h1>
                <Dropzone onFileUploaded={setSelectedFile} />
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome</label>
                        <input 
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereco</h2>
                        <span>Selecione o endereco no mapa</span>
                    </legend>

                    <Map
                        center={initialPosition} 
                        zoom={15}
                        onClick={handleSelectedPosition}
                    >
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />                        
                        {
                            !selectedPosition[0] ?
                                <Marker position={initialPosition} />
                            : <Marker position={selectedPosition} />
                        }
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estados (UF)</label>
                            <select 
                                name="uf"
                                id="uf" 
                                onChange={handleSelectUf}
                                value={selectedUf}
                            >
                                <option value="0">Selecione seu Estado</option>
                                {
                                    ufs.map(uf => (
                                        <option key={uf} value={uf}>{uf}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                                name="city" 
                                id="city"
                                value={selectdedCity}
                                onChange={handleSelectedCity}
                            >
                                <option value="0">Selecione sua Cidade</option>
                                {
                                    cities.map(city => (
                                        <option value={city} key={city} >{city}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>                    
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens da Coleta</h2>
                        <span>Selecione um ou mais itens de coleta.</span>
                    </legend>
                    
                    <ul className="items-grid">
                        {
                            items.map( item  => (
                                <li 
                                    key={item.id}
                                    onClick={() => handleSelectedItem(item.id)}
                                    className={itemSelected.includes(item.id) ? "selected" : ""}
                                >
                                    <img src={item.image_url} alt={item.title}/>
                                    <span>{item.title}</span>
                                </li>
                            ))
                        }
                                                
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar Point
                </button>
            </form>
        </div>
    );
}

export default Createpoint;