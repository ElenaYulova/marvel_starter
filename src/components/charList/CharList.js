import { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemsLoading: false,
        offset: 210,
        charListEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
         this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemsLoading: true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({offset, charList}) => (
            {
            charList: [...charList, ...newCharList], 
            loading: false,
            newItemsLoading: false,
            offset: offset + 9,
            charListEnded: ended
            }
        ))
    }

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    renderCharList = (charList) => {
        const items =  charList.map((item, i) => {
            let thumbStyle = {};
            item.thumbnail.includes('image_not_available') ? thumbStyle = {'objectFit' : 'unset'} : thumbStyle = {'objectFit' : 'cover'};
            return (
                <li 
                    ref={this.setRef}
                    key={item.id} 
                    className="char__item"
                    tabIndex={0}
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
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

    render() {
        const {charList, loading, error, offset, newItemsLoading, charListEnded} = this.state;
        let chars = this.renderCharList(charList);
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
                onClick={() => this.onRequest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;
