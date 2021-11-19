# NX-autolearn
<h2><a href="NX.html">Noughts and crosses version 1</a></h2>
<p>Initial version of noughts and crosses game. Bit broken...</p>
<h2><a href="NX2.html">Noughts and crosses version 2</a></h2>
<p>Second version of noughts and crosses game, which actually works!<br/>
Please note the "Intelligent" difficulty setting is not that intelligent. Whilst the "Low" setting plays randomly, the intelligent one stores previous game information and uses a simple algorithm to look at the previous games, then selects a move which would most likely lead to a win. As the data is stored locally it has a steep learning curve for each user/browser it encounters. The method it uses to select a possible route to winning, is based on how frequently a sequence of moves is repeated which lead to a win, then chooses the next move in that sequence.</p>
<h3>Further work...</h3>
<p>This requires further work to speed up the learning process, or change it entirely to one in which it learns what a win is, then the different ways in which it can win, and then the ability to detect an imminent win, before detecting patterns which leads to wins.</p>