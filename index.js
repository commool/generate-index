'use strict';

var fs = require('fs'),
	path = require('path'),
	cheerio = require('cheerio');

module.exports = function() {
	// 변수 정의
	var dirPath = 'dist/', // 해당 폴더 경로

		// html 과 page title 리스트
		htmlList = [],
		titleList = [],

		// 사용자 정보
		projectName = '미디어젠',
		author = '조영광, 권태완';
	
	getHtmlList(dirPath);
	getTitleList(htmlList, dirPath);
	createIndex('src/@index.html');

	// html 리스트 추출
	function getHtmlList(path){
		var _allFiles = fs.readdirSync(path);

		for(var index in _allFiles){
			var _list = _allFiles[index];

			// html파일인지 확인 후 htmlList에 추가
			var _check = _list.indexOf('.html');

			if( _check !== -1 ) {
				htmlList.push(_list);
			}
		}
	}

	// page title 추출
	function getTitleList(arr, path){
		for ( var i=0 ; i < arr.length ; i++ ) {
			var _data = fs.readFileSync(path + arr[i], 'utf-8');

			// <title> 추출 후 titleList에 추가
			var pattern = /<title>([\s\S]*)<\/title>/i,
				title = pattern.exec(_data)[1];
				
				titleList.push(title);
		}
	}

	// @index.html
	function createIndex(file){

		// htmlTemplate 파일 참조
		var templatePath = path.join(__dirname, 'template/@temp.html'),
			htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

		// @index.html에 템플릿 코드 생성
		fs.writeFileSync(file, htmlTemplate, 'utf8');

		// DOM 내용 변경
		var $ = cheerio.load(htmlTemplate, {
			decodeEntities: false // 한글 인코딩 문제
		});

		// 프로젝트명
		$('#title').text(projectName);

		// 작업자
		$('#admin').text('작업자 : ' + author);

		// 현재 시간
		var _t = new Date(),
			time = _t.getFullYear() + '.' +
					_t.getMonth() + 1 + '.' + 
					_t.getDate() + '. ' +
					_t.getHours() + ':' +
					_t.getMinutes();

		// 마지막 수정
		$('#date').text('마지막 수정 : ' + time)
		
		// 인덱스 리스트
		for (var i = 0; i < htmlList.length; i++ ) {
			$('#list').append('<li><a href='+ '../dist/' + path.normalize(htmlList[i]) +'>' + titleList[i] + '<span>/ ' + path.normalize(htmlList[i]) + '</span>' + '</a></li>');
		}

		// 변경 내용 쓰기
		fs.writeFileSync(file, $.html(), 'utf-8')

	}

}