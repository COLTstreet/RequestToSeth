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
  selectedShow = {
    genres: [{name: ''}],
    genreString: '',
    episode_run_time: [],
    videos: {results: [{key: ''}]}
  };
  showTitleContent: boolean;
  selectedTitles = [];
  searchType = 1;
  masterMoviesList = {
    results: []
  }
  masterTvList = {
    results: []
  }
  searchText = {
    value: ''
  }

  ngOnInit() {
    this.showTitleContent = false;
    this.selectedTitle = {
      homepage: '',

    }
    this.viewMovies();
    this.viewShows();
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

  selectType(val){
    if(this.searchType != val){
      this.searchType = val;
      $("#sLeft").toggleClass('selected');
      $("#sRight").toggleClass('selected');
      if(val === 1) {
        $("#movie-section").show();
        $("#tv-section").hide();
      } else {
        $("#movie-section").hide();
        $("#tv-section").show();
      }
    }
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
        if(this.selectedTitle.genres[i]) {
          if(i === 1){
            this.selectedTitle.genreString += this.selectedTitle.genres[i].name;
          } else {
            this.selectedTitle.genreString = '';
            this.selectedTitle.genreString += this.selectedTitle.genres[i].name + ", ";
          }
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

  selectShow(id, show) {
    //Loading On
    this.showProgressBar = true;
    //Popular movies call
    //Create an Observable that will create an AJAX request
    const apiData = ajax('https://api.themoviedb.org/3/tv/' + show.id + '?api_key=7f5c7cfc2f811e4c7c6c6e5ee73bba99&language=en-US&append_to_response=videos');
    //Subscribe to create the request
    apiData.subscribe(res => {
      this.selectedShow = res.response;
      this.showTitleContent = true;
      console.log(res.status, res.response);

      for(var i = 0; i < 2; i++) {
        if(this.selectedShow.genres[i]) {
          if(i === 1){
            this.selectedShow.genreString += this.selectedShow.genres[i].name;
          } else {
            this.selectedShow.genreString = '';
            this.selectedShow.genreString += this.selectedShow.genres[i].name + ", ";
          }
        }
      }

      console.log(this.selectedShow);

      // var height = $("#movie-info-container-" + id).outerHeight();
      // $("#movie-trailer-container-" + id).attr("src", "https://www.youtube.com/embed/" + this.selectedShow.videos.results[0].key);
      // $("#movie-tile-lg-info-container-" + id).css("height", height);
      let vm = this;
      $(function() {
        $("#tv-trailer-container-" + id).attr("src", "https://www.youtube.com/embed/" + vm.selectedShow.videos.results[0].key);
      });

      //Loading Complete
      this.showProgressBar = false;
    });
  }

  goToIMDB() {
    window.open('http://www.imdb.com/title/' + this.selectedTitle.imdb_id + '/', '_blank');
  }

  expand(id, mov){
    if(this.searchType === 1){
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
        $('#div-' + id).height(window.innerHeight - 65);
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
    } else {
      if($('#div-tv-' + id).hasClass("fullScreen")) {
        $('#div-tv-' + id).height(300);
        $('#div-tv-' + id).css('width', '');
        $('#tv-title-' + id).show();
        $('#mcp-tv-' + id).show();
        $('#tv-content-' + id).hide();
        for(let i = 0; i < this.masterMoviesList.results.length; i++){
          if(i != id){
            $('#div-tv-' + i).show();
          }
        }
        $(window).scrollTop(this.scrollPos);
        this.showTitleContent = false;
      } else {
        this.selectShow(id, mov);
        this.scrollPos = $(window).scrollTop();
        $('#div-tv-' + id).height(window.innerHeight - 65);
        $('#div-tv-' + id).width(window.innerWidth);
        $('#tv-title-' + id).hide();
        $('#mcp-tv-' + id).hide();
        $('#tv-content-' + id).show();
        for(let i = 0; i < this.masterMoviesList.results.length; i++){
          if(i != id){
            $('#div-tv-' + i).hide();
          }
        }
      }
      $('#div-tv-' + id).toggleClass("fullScreen");
    }
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

  addRemoveShow(show, id) {
    if(this.selectedTitles.indexOf(show.original_name) === -1) {
      this.selectedTitles.push(show.original_name);
      $('#qAdd-tv-' + id).hide();
      $('#qCheck-tv-' + id).show();
      $('#add-tv-' + id).hide();
      $('#check-tv-' + id).show();
    } else {
      this.selectedTitles.splice(this.selectedTitles.indexOf(show.original_name), 1);
      $('#qAdd-tv-' + id).show();
      $('#qCheck-tv-' + id).hide();
      $('#add-tv-' + id).show();
      $('#check-tv-' + id).hide();
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

  viewShows() {
    //Loading On
    this.showProgressBar = true;
    //Popular tv call
    //Create an Observable that will create an AJAX request
    const apiData = ajax('https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=7f5c7cfc2f811e4c7c6c6e5ee73bba99');
    //Subscribe to create the request
    apiData.subscribe(res => {
      this.masterTvList = res.response;

      //Loading Complete
      this.showProgressBar = false;
    });
  }

  search() {
    if(this.searchText.value != ''){
      if(this.searchType === 1){
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
      } else {
        this.showProgressBar = true;
        let query = encodeURI(this.searchText.value);
        //Create an Observable that will create an AJAX request
        const searchData = ajax("https://api.themoviedb.org/3/search/tv?api_key=7f5c7cfc2f811e4c7c6c6e5ee73bba99&query=" + query);
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
}
