import { Component, OnInit } from '@angular/core';
import { ajax } from 'rxjs/ajax';
import { FormControl, FormGroupDirective, NgForm, Validators }   from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import * as $ from 'jquery';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'movie-lookup';
  showProgressBar = false;
  scrollPos = 0;
  selectedTitle: any;
  showTitleContent: boolean;
  masterMoviesList = {
    results: []
  }
  selectedTitles = [];
  searchText = {
    value: ''
  }

  ngOnInit() {
    this.showTitleContent = false;
    this.selectedTitle = {
      homepage: '',

    }
    this.viewMovies();
  }

  sendRequest() {
    var email = "sbframp@gmail.com";
    var subject = "Plex Requests";
    var body = "";

    for(var i = 0; i < this.selectedTitles.length; i++) {
      var movie = this.selectedTitles[i].replace("&", "and");
      body += movie + ", "
    }

    window.location.href = "mailto:" + email + "?subject=" + subject + "&body=" + body;
  }

  selectTitle(id, mov) {
    //Loading On
    this.showProgressBar = true;
    //Popular movies call
    //Create an Observable that will create an AJAX request
    const apiData = ajax('https://api.themoviedb.org/3/movie/' + mov.id + '?api_key=7f5c7cfc2f811e4c7c6c6e5ee73bba99&language=en-US&append_to_response=videos');
    //Subscribe to create the request
    apiData.subscribe(res => {
      this.selectedTitle = res.response;
      this.showTitleContent = true;
      console.log(res.status, res.response);

      for(var i = 0; i < 2; i++) {
        if(i === 1){
          this.selectedTitle.genreString += this.selectedTitle.genres[i].name;
        } else {
          this.selectedTitle.genreString = '';
          this.selectedTitle.genreString += this.selectedTitle.genres[i].name + ", ";
        }
      }

      // var height = $("#movie-info-container-" + id).outerHeight();
      // $("#movie-trailer-container-" + id).attr("src", "https://www.youtube.com/embed/" + this.selectedTitle.videos.results[0].key);
      // $("#movie-tile-lg-info-container-" + id).css("height", height);
      let vm = this;
      $(function() {
        $("#movie-trailer-container-" + id).attr("src", "https://www.youtube.com/embed/" + vm.selectedTitle.videos.results[0].key);
      });

      //Loading Complete
      this.showProgressBar = false;
    });
  }

  goToIMDB() {
    window.open('http://www.imdb.com/title/' + this.selectedTitle.imdb_id + '/', '_blank');
  }

  expand(id, mov){
    if($('#div-' + id).hasClass("fullScreen")) {
      $('#div-' + id).height(300);
      $('#div-' + id).css('width', '');
      $('#movie-title-' + id).show();
      $('#mcp-' + id).show();
      $('#movie-content-' + id).hide();
      for(let i = 0; i < this.masterMoviesList.results.length; i++){
        if(i != id){
          $('#div-' + i).show();
        }
      }
      $(window).scrollTop(this.scrollPos);
      this.showTitleContent = false;
    } else {
      this.selectTitle(id, mov);
      this.scrollPos = $(window).scrollTop();
      $('#div-' + id).height(window.innerHeight - 40);
      $('#div-' + id).width(window.innerWidth);
      $('#movie-title-' + id).hide();
      $('#mcp-' + id).hide();
      $('#movie-content-' + id).show();
      for(let i = 0; i < this.masterMoviesList.results.length; i++){
        if(i != id){
          $('#div-' + i).hide();
        }
      }
    }
    $('#div-' + id).toggleClass("fullScreen");
  }

  addRemove(mov, id) {
    if(this.selectedTitles.indexOf(mov.original_title) === -1) {
      this.selectedTitles.push(mov.original_title);
      $('#qAdd-' + id).hide();
      $('#qCheck-' + id).show();
      $('#add-' + id).hide();
      $('#check-' + id).show();
    } else {
      this.selectedTitles.splice(this.selectedTitles.indexOf(mov.original_title), 1);
      $('#qAdd-' + id).show();
      $('#qCheck-' + id).hide();
      $('#add-' + id).show();
      $('#check-' + id).hide();
    }
    console.log(this.selectedTitles);
  }

  viewMovies() {
    //Loading On
    this.showProgressBar = true;
    //Popular movies call
    //Create an Observable that will create an AJAX request
    const apiData = ajax('https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=7f5c7cfc2f811e4c7c6c6e5ee73bba99');
    //Subscribe to create the request
    apiData.subscribe(res => {
      this.masterMoviesList = res.response;

      //Loading Complete
      this.showProgressBar = false;
    });
  }

  search() {
    if(this.searchText.value != ''){
      this.showProgressBar = true;
      let query = encodeURI(this.searchText.value);
      //Create an Observable that will create an AJAX request
      const searchData = ajax("https://api.themoviedb.org/3/search/movie?api_key=7f5c7cfc2f811e4c7c6c6e5ee73bba99&query=" + query);
      //Subscribe to create the request
      searchData.subscribe(res => {
        this.masterMoviesList = res.response;
        console.log(res.status, res.response)

        //Loading Complete
        this.showProgressBar = false;
      });
    }
  }
}
