import React from 'react';
import './index.css';

class Favourites extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            itemsFav: []
        }
    }
    render(){

        return(
            <div>
                <h2>Favourites</h2>
                <table>
                    <tbody>
                        {this.state.itemsFav.map(item => (
                        <tr>
                            <td><img src={item.artworkUrl100} alt="none" controls/></td>
                            <td>{item.artistName}</td>
                            <td>{item.trackName}</td>
                            <td>{item.primaryGenreName}</td>
                            <td><audio src={item.previewUrl} controls/></td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        )
    }
}
export default Favourites;