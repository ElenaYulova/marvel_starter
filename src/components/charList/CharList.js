import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charListEnded, setCharListEnded] = useState(false);

    const marvelService = new MarvelService();


    const onRequest = (offset) => {
        onCharListLoading();
         marvelService.getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError);
    }

    useEffect(() => {
        onRequest();
    }, [])

    const onCharListLoading = () => {
        setNewItemsLoading(true);
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setLoading(loading => false);
        setNewItemsLoading(newItemsLoading => false);
        setOffset(offset => offset + 9);
        setCharListEnded(charListEnded => ended);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function renderCharList(charList) {
        const items =  charList.map((item, i) => {
            let thumbStyle = {};
            item.thumbnail.includes('image_not_available') ? thumbStyle = {'objectFit' : 'unset'} : thumbStyle = {'objectFit' : 'cover'};
            return (
                <li 
                    ref={el => itemRefs.current[i] = el}
                    key={item.id} 
                    className="char__item"
                    tabIndex={0}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}
                    >
                        <img src={item.thumbnail} alt={item.name} style={thumbStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });
        
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )

    }

    let chars = renderCharList(charList);
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? chars : null;

    return (    
        <div className="char__list">

            {errorMessage}
            {spinner}
            {content}

            <button 
                className="button button__main button__long"
                disabled={newItemsLoading}
                style={{'display': charListEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )

}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;
