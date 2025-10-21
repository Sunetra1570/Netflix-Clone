// netflix.js
// Full SPA behavior for the Netflix-like demo

// TVMaze client (no API key)
const TVMAZE_BASE = 'https://api.tvmaze.com';
async function tvmaze(path, params = {}) {
    const url = new URL(TVMAZE_BASE + path);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('TVMaze request failed: ' + res.status);
    return res.json();
}


// OMDb API client (free, no key needed for basic searches)
const OMDB_BASE = 'https://www.omdbapi.com';

// Real movie poster URLs from TMDB (The Movie Database)
const moviePosters = {
    // Popular Movies
    'The Shawshank Redemption': 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    'The Godfather': 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    'The Dark Knight': 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    'Pulp Fiction': 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    'Forrest Gump': 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    'Inception': 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    'The Matrix': 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    'Goodfellas': 'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg',
    'Titanic': 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
    'Avatar': 'https://image.tmdb.org/t/p/w500/7ABo4HU6PSqEdzp1IJgqJpgmKu4.jpg',
    'The Lord of the Rings': 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
    'Star Wars': 'https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',
    'Casablanca': 'https://image.tmdb.org/t/p/w500/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg',
    'Schindler\'s List': 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
    
    // Action Movies
    'Die Hard': 'https://image.tmdb.org/t/p/w500/yFihWxQcmqcaBR31QM6Y8gT6aYV.jpg',
    'Mad Max: Fury Road': 'https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg',
    'John Wick': 'https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg',
    'The Avengers': 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
    'Mission: Impossible': 'https://image.tmdb.org/t/p/w500/vzvKcPQ4o7TjWeGIn0aGC9FeVNu.jpg',
    'Fast & Furious': 'https://image.tmdb.org/t/p/w500/mc7MubOLcIw3MDvnuQFrO9psfCa.jpg',
    'Terminator 2': 'https://image.tmdb.org/t/p/w500/5M0j0B18abtBI5gi2RhfjjurTqb.jpg',
    'Gladiator': 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
    'Speed': 'https://image.tmdb.org/t/p/w500/1l9ADgbSMWBtyFaU8WT6zFz8o3z.jpg',
    'Heat': 'https://image.tmdb.org/t/p/w500/umSVeIzjU8tqDBkJ7DO3dT3Sqvw.jpg',
    'Lethal Weapon': 'https://image.tmdb.org/t/p/w500/5M0j0B18abtBI5gi2RhfjjurTqb.jpg',
    'Rush Hour': 'https://image.tmdb.org/t/p/w500/rOl4fzAcIKJkZ7m7OUhKU5QJE8H.jpg',
    'Bad Boys': 'https://image.tmdb.org/t/p/w500/xvNfX4aCQP7E5tJSPP9AKK5VjK4.jpg',
    
    // Comedy Movies
    'The Hangover': 'https://image.tmdb.org/t/p/w500/xxXF3wDm5N4DyNKRp2CrhW7HQ7F.jpg',
    'Superbad': 'https://image.tmdb.org/t/p/w500/ek8e8txUyUwd2BNqj6lFEerJfbq.jpg',
    'Anchorman': 'https://image.tmdb.org/t/p/w500/7SlC5t4rfAhHJcVY9bwrxVfcckN.jpg',
    'Dumb and Dumber': 'https://image.tmdb.org/t/p/w500/4LdpBXiCyGKkR8FGHgjKlphrfUc.jpg',
    'Meet the Parents': 'https://image.tmdb.org/t/p/w500/iCdJrR9SkF1yzLLe0LWbRDJCCdb.jpg',
    'Ghostbusters': 'https://image.tmdb.org/t/p/w500/wOPvBIKWpXMdtKFZcH60nKJOYFe.jpg',
    'Coming to America': 'https://image.tmdb.org/t/p/w500/yidxKrFIEjjPDqMx0tP1cmkSKIN.jpg',
    'The Mask': 'https://image.tmdb.org/t/p/w500/1EZs4Ddu5Tj76hnX6qNh6M2NrDF.jpg',
    'Ace Ventura': 'https://image.tmdb.org/t/p/w500/pqiRuETmuSybPRd8b7Qs4MEzcsF.jpg',
    'Wedding Crashers': 'https://image.tmdb.org/t/p/w500/lFM3lk2zVzC1YFnKm0r7z0bUvOY.jpg',
    'Old School': 'https://image.tmdb.org/t/p/w500/qPLfQSDKlpY8jI7KSotDjWcTayq.jpg',
    'Zoolander': 'https://image.tmdb.org/t/p/w500/qdrbSneHZjJG2Dj0hhBxzzAo4HB.jpg',
    'Napoleon Dynamite': 'https://image.tmdb.org/t/p/w500/jZdE4dGn0kCCrRwf7gWLWdCVaM0.jpg',
    
    // Drama Movies
    'One Flew Over the Cuckoo\'s Nest': 'https://image.tmdb.org/t/p/w500/2Sns5oMb356JNdBHgBETjIpTkxe.jpg',
    'Good Will Hunting': 'https://image.tmdb.org/t/p/w500/bABCBKYBK7A5G1x0FzoeoNfuj2.jpg',
    'A Beautiful Mind': 'https://image.tmdb.org/t/p/w500/4SFqHDZ1NvWdysucWbgnYlobdxC.jpg',
    'The Pursuit of Happyness': 'https://image.tmdb.org/t/p/w500/12vHZ4Na5NGUIJIMGpVKG2ijhCk.jpg',
    'Rain Man': 'https://image.tmdb.org/t/p/w500/dqHWz7g2XTfGeF30gDeJzpFi6EF.jpg',
    'Dead Poets Society': 'https://image.tmdb.org/t/p/w500/3DPPlP4fLY8xLYLNL8-3b2Td7Qg.jpg',
    'The Green Mile': 'https://image.tmdb.org/t/p/w500/velWPhVMQeQKcxggNEU8YmIo52R.jpg',
    'Saving Private Ryan': 'https://image.tmdb.org/t/p/w500/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg',
    
    // Horror Movies
    'The Exorcist': 'https://image.tmdb.org/t/p/w500/4ucLGcXVVSVMM44vdQrsPPl8jKe.jpg',
    'Halloween': 'https://image.tmdb.org/t/p/w500/wijlZ3HaYMvlDTPqJoTCWKFkCPU.jpg',
    'A Nightmare on Elm Street': 'https://image.tmdb.org/t/p/w500/5QdBeMWqRRgWCHjHdwJcvqWM1BS.jpg',
    'Friday the 13th': 'https://image.tmdb.org/t/p/w500/HzrPn1gEHWixfMOvOehOTlHROo.jpg',
    'The Shining': 'https://image.tmdb.org/t/p/w500/b6ko0IKC8MdYBBPkkA1aBPLh4ls.jpg',
    'Psycho': 'https://image.tmdb.org/t/p/w500/yz4QVqPx3h1hD1DfqqQkCq3rmxW.jpg',
    'Scream': 'https://image.tmdb.org/t/p/w500/7MW6sAqFlZOPNWUdsGY6A7F0Tj.jpg',
    'The Texas Chain Saw Massacre': 'https://image.tmdb.org/t/p/w500/wbNr5RnQnC5Kj0rE3hF0vwmdQr2.jpg',
    'Jaws': 'https://image.tmdb.org/t/p/w500/lxM6kqilAdpdhqUl2biYp5frUxE.jpg',
    'Alien': 'https://image.tmdb.org/t/p/w500/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg',
    'The Thing': 'https://image.tmdb.org/t/p/w500/tzGY49kseSE9QAKk47uuDGwnSCu.jpg',
    'Poltergeist': 'https://image.tmdb.org/t/p/w500/yXieSH1fkrqJE0RBowCjZJ8D3wC.jpg',
    'Child\'s Play': 'https://image.tmdb.org/t/p/w500/sGzuQzJ8faX2zKLu6Cz7EeRl85W.jpg',
    'It': 'https://image.tmdb.org/t/p/w500/9E2y5Q7WlCVNEhP5GiVTjhEhx1o.jpg',
    
    // Sci-Fi Movies
    'Blade Runner': 'https://image.tmdb.org/t/p/w500/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg',
    'Aliens': 'https://image.tmdb.org/t/p/w500/r1x5JGpyqZU8PYhbs4UcrO1Xb6x.jpg',
    'The Terminator': 'https://image.tmdb.org/t/p/w500/qvktm0BHcnmDpul4Hz01GIazWPr.jpg',
    'Back to the Future': 'https://image.tmdb.org/t/p/w500/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg',
    'E.T.': 'https://image.tmdb.org/t/p/w500/6bRe8GiSJewdSjh1gBHoELvnvQ1.jpg',
    'Close Encounters': 'https://image.tmdb.org/t/p/w500/yR3JjKLr81mY1MnMg0Y1PtXiAL8.jpg',
    'Independence Day': 'https://image.tmdb.org/t/p/w500/71BqNX2aTQ0Tjko79RZxuWHSCwR.jpg',
    'Men in Black': 'https://image.tmdb.org/t/p/w500/f24UVKq3UiQWLqGWdqjwkzgB8j8.jpg',
    'The Fifth Element': 'https://image.tmdb.org/t/p/w500/fPtlCO1yQtnoLHOwKtWz7db6RGU.jpg',
    'Total Recall': 'https://image.tmdb.org/t/p/w500/rDNn1F8dYVRUVV5IFg5jJVTlqIJ.jpg',
    'Minority Report': 'https://image.tmdb.org/t/p/w500/w0xrfwt6FYTNeeSSsZcTOlm8e0J.jpg',
    
    // Romance Movies
    'The Notebook': 'https://image.tmdb.org/t/p/w500/qom1SZSENdmHFNZBXbtJAU0WTlC.jpg',
    'Ghost': 'https://image.tmdb.org/t/p/w500/w9RaPHOUOmPMx4xrNdZwXJOOPQp.jpg',
    'Pretty Woman': 'https://image.tmdb.org/t/p/w500/dqFH0B5L5NrSGWjk9LY6RglfJgW.jpg',
    'When Harry Met Sally': 'https://image.tmdb.org/t/p/w500/lF3kTpMqQjgaY0KzqnhqLkLXYSO.jpg',
    'Sleepless in Seattle': 'https://image.tmdb.org/t/p/w500/afkYP15OeUOD0tFEmj6VvejuOcz.jpg',
    'You\'ve Got Mail': 'https://image.tmdb.org/t/p/w500/2mJjDdVkIstYbkIGCDKj5DvnRsR.jpg',
    'The Princess Bride': 'https://image.tmdb.org/t/p/w500/dvjqlp2sAhUeFjUOfQDgNNOaXmP.jpg',
    'Dirty Dancing': 'https://image.tmdb.org/t/p/w500/2S6Uyp28ykqrRyJOmBaEtaORDWH.jpg',
    'Top Gun': 'https://image.tmdb.org/t/p/w500/xUuHj3CgmZQ9P2cMaqQs4J0d4Zc.jpg',
    'Jerry Maguire': 'https://image.tmdb.org/t/p/w500/n2y4Q4cAr8VTd1wIbjdyEbkm3X2.jpg',
    
    // Thriller Movies
    'The Silence of the Lambs': 'https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg',
    'Seven': 'https://image.tmdb.org/t/p/w500/6yoghtyTpznpBik8EngEmJskVUO.jpg',
    'The Sixth Sense': 'https://image.tmdb.org/t/p/w500/fIssD3w3SvIhAp2LSPISkqmFLyC.jpg',
    'North by Northwest': 'https://image.tmdb.org/t/p/w500/wN5Py7rCrILXr9jJRnw9DsJuH8O.jpg',
    'Vertigo': 'https://image.tmdb.org/t/p/w500/15uOEfqBNTVnDiGJlr9EKQdAUdE.jpg',
    'Rear Window': 'https://image.tmdb.org/t/p/w500/ILVF0eJxHMddjxeQhswFtpMtqx.jpg',
    'The Fugitive': 'https://image.tmdb.org/t/p/w500/78M3yRQM5gK24tJnJhP7kKc9dLu.jpg',
    'Cape Fear': 'https://image.tmdb.org/t/p/w500/rksOqcJ7i2DCtfWlUbFxqv8HQMh.jpg',
    'Fatal Attraction': 'https://image.tmdb.org/t/p/w500/p9QtYTAhIVUNjBM1R3YyTNOYhD8.jpg',
    'Basic Instinct': 'https://image.tmdb.org/t/p/w500/9bXiEZhGMtaMhQPgR9Z6Ak9j6IZ.jpg',
    'Shutter Island': 'https://image.tmdb.org/t/p/w500/4GDy0PHYX3VRXUtwK5ysFbg3kEx.jpg',
    
    // Family & Animated Movies
    'The Lion King': 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg',
    'Toy Story': 'https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg',
    'Finding Nemo': 'https://image.tmdb.org/t/p/w500/eHuGQ10FUzK1mdOY69wF5pGgEf5.jpg',
    'Shrek': 'https://image.tmdb.org/t/p/w500/iB64vpL3dIObOtMZgX3RqdVdQDc.jpg',
    'The Incredibles': 'https://image.tmdb.org/t/p/w500/2LqaLgk4Z226KkgPJuiOQ58wvrm.jpg',
    'Monsters, Inc.': 'https://image.tmdb.org/t/p/w500/sgheSKxZkttIe8ONsf2sWXPgip3.jpg',
    'Up': 'https://image.tmdb.org/t/p/w500/mFheTibdoegYBf5hOPaLSwmP79k.jpg',
    'WALL-E': 'https://image.tmdb.org/t/p/w500/hbhFnRzzg6ZDmm8YAmxBnQpQIPh.jpg',
    'Frozen': 'https://image.tmdb.org/t/p/w500/kgwjIb2JDHRhNk13lmSxiClFjVk.jpg',
    'Moana': 'https://image.tmdb.org/t/p/w500/4JeejGugONWpJkbnvL12hVoYEDa.jpg',
    'Coco': 'https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg',
    'Inside Out': 'https://image.tmdb.org/t/p/w500/2H1TmgdfNtsKlU9jKdeNyYL5y8T.jpg',
    'Zootopia': 'https://image.tmdb.org/t/p/w500/hlK0e0wAQ3VLuJcsfIYPvb4JVud.jpg',
    'Soul': 'https://image.tmdb.org/t/p/w500/hm58Jw4Lw8OIeECIq5qyPYhAeRJ.jpg',
    'Luca': 'https://image.tmdb.org/t/p/w500/jTswp6KyDYKtvC52GbHagrZbGvD.jpg',
    'Encanto': 'https://image.tmdb.org/t/p/w500/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg',
    
    // War Movies
    'Apocalypse Now': 'https://image.tmdb.org/t/p/w500/gQB8Y5RCMkv2zwzFHbUJX3kAhvA.jpg',
    'Platoon': 'https://image.tmdb.org/t/p/w500/m3mmFkPQKvPZq5exmh0bDuXlD9T.jpg',
    'Full Metal Jacket': 'https://image.tmdb.org/t/p/w500/q3mKoJSJsyl7Kd39XuqjBHO1lWn.jpg',
    'Black Hawk Down': 'https://image.tmdb.org/t/p/w500/7cqKGQMnNabzOaWNgPeg4taAl3Z.jpg',
    'We Were Soldiers': 'https://image.tmdb.org/t/p/w500/q2LPw2bDjGkr8RBomg75vXu2fKn.jpg',
    'Born on the Fourth of July': 'https://image.tmdb.org/t/p/w500/uKWOe6LGjb5DR8WrNBKNfQDxCvJ.jpg',
    'The Deer Hunter': 'https://image.tmdb.org/t/p/w500/uLQgg2QfhD1wfF2WZt1mCxV1wMm.jpg',
    'Good Morning, Vietnam': 'https://image.tmdb.org/t/p/w500/mI9bywEe9a14vEXXHlsVqN0bCOp.jpg',
    
    // Crime Movies
    'Scarface': 'https://image.tmdb.org/t/p/w500/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg',
    'Casino': 'https://image.tmdb.org/t/p/w500/4TS5O1IP42bY2BvgMVNUwMYQB4S.jpg',
    'The Departed': 'https://image.tmdb.org/t/p/w500/tGLO9zw5ZtCeyyEWgbYGgsFxC6i.jpg',
    'Donnie Brasco': 'https://image.tmdb.org/t/p/w500/A3xF1lmGIGFE3H6PJhQjGHpgFqP.jpg',
    'The Untouchables': 'https://image.tmdb.org/t/p/w500/ey6qmTLFkaH8aaiBGqJqagxUWOx.jpg',
    'Carlito\'s Way': 'https://image.tmdb.org/t/p/w500/w8dQKOE6pfKXL8oLVYIIxfw1dsj.jpg'
};

async function fetchMovies(genre = 'popular', page = 1) {
    try {
        // Comprehensive movie database organized by genre
        const moviesByGenre = {
            popular: [
                'The Shawshank Redemption', 'The Godfather', 'The Dark Knight', 'Pulp Fiction',
                'Forrest Gump', 'Inception', 'The Matrix', 'Goodfellas', 'Titanic', 'Avatar',
                'The Lord of the Rings', 'Star Wars', 'Casablanca', 'Schindler\'s List'
            ],
            action: [
                'Die Hard', 'Mad Max: Fury Road', 'John Wick', 'The Avengers', 'Mission: Impossible',
                'Fast & Furious', 'Terminator 2', 'Gladiator', 'The Matrix', 'Speed',
                'Heat', 'Lethal Weapon', 'Rush Hour', 'Bad Boys'
            ],
            comedy: [
                'The Hangover', 'Superbad', 'Anchorman', 'Dumb and Dumber', 'Meet the Parents',
                'Ghostbusters', 'Coming to America', 'The Mask', 'Ace Ventura', 'Rush Hour',
                'Wedding Crashers', 'Old School', 'Zoolander', 'Napoleon Dynamite'
            ],
            drama: [
                'The Shawshank Redemption', 'Forrest Gump', 'One Flew Over the Cuckoo\'s Nest',
                'Good Will Hunting', 'A Beautiful Mind', 'The Pursuit of Happyness', 'Rain Man',
                'Dead Poets Society', 'The Green Mile', 'Saving Private Ryan', 'Gladiator'
            ],
            horror: [
                'The Exorcist', 'Halloween', 'A Nightmare on Elm Street', 'Friday the 13th',
                'The Shining', 'Psycho', 'Scream', 'The Texas Chain Saw Massacre', 'Jaws',
                'Alien', 'The Thing', 'Poltergeist', 'Child\'s Play', 'It'
            ],
            scifi: [
                'Blade Runner', 'The Matrix', 'Star Wars', 'Aliens', 'The Terminator',
                'Back to the Future', 'E.T.', 'Close Encounters', 'Independence Day',
                'Men in Black', 'The Fifth Element', 'Total Recall', 'Minority Report'
            ],
            romance: [
                'Titanic', 'The Notebook', 'Casablanca', 'Ghost', 'Pretty Woman',
                'When Harry Met Sally', 'Sleepless in Seattle', 'You\'ve Got Mail',
                'The Princess Bride', 'Dirty Dancing', 'Top Gun', 'Jerry Maguire'
            ],
            thriller: [
                'The Silence of the Lambs', 'Seven', 'The Sixth Sense', 'Psycho',
                'North by Northwest', 'Vertigo', 'Rear Window', 'The Fugitive',
                'Cape Fear', 'Fatal Attraction', 'Basic Instinct', 'Shutter Island'
            ],
            family: [
                'The Lion King', 'Toy Story', 'Finding Nemo', 'Shrek', 'The Incredibles',
                'Monsters, Inc.', 'Up', 'WALL-E', 'Frozen', 'Moana', 'Coco', 'Inside Out'
            ],
            animated: [
                'Toy Story', 'Shrek', 'Finding Nemo', 'The Incredibles', 'Up', 'WALL-E',
                'Inside Out', 'Zootopia', 'Moana', 'Coco', 'Soul', 'Luca', 'Encanto'
            ],
            war: [
                'Saving Private Ryan', 'Apocalypse Now', 'Platoon', 'Full Metal Jacket',
                'Black Hawk Down', 'We Were Soldiers', 'Born on the Fourth of July',
                'The Deer Hunter', 'Good Morning, Vietnam', 'Top Gun'
            ],
            crime: [
                'The Godfather', 'Goodfellas', 'Scarface', 'Casino', 'Pulp Fiction',
                'The Departed', 'Heat', 'Donnie Brasco', 'The Untouchables', 'Carlito\'s Way'
            ]
        };
        
        const genreMovies = moviesByGenre[genre] || moviesByGenre.popular;
        const startIndex = (page - 1) * 12;
        const endIndex = Math.min(startIndex + 12, genreMovies.length);
        
        const movies = genreMovies.slice(startIndex, endIndex).map((title, index) => {
            // Smart poster lookup with fallback logic
            let posterUrl = moviePosters[title];
            
            // If exact match not found, try partial matches
            if (!posterUrl) {
                const keys = Object.keys(moviePosters);
                const partialMatch = keys.find(key => 
                    key.toLowerCase().includes(title.toLowerCase()) || 
                    title.toLowerCase().includes(key.toLowerCase())
                );
                if (partialMatch) posterUrl = moviePosters[partialMatch];
            }
            
            // Final fallback to a high-quality placeholder or random poster
            if (!posterUrl) {
                posterUrl = FALLBACK_POSTERS[Math.floor(Math.random() * FALLBACK_POSTERS.length)];
            }
            
            const backdropUrl = posterUrl; // Use the same image for backdrop
            
            return {
                id: `movie_${genre}_${page}_${index}`,
                title: title,
                overview: `${title} is an acclaimed ${genre} movie that has captivated audiences worldwide with its compelling story and outstanding performances.`,
                img: posterUrl,
                backdrop: backdropUrl,
                genres: [genre.charAt(0).toUpperCase() + genre.slice(1)],
                rating: (7 + Math.random() * 3).toFixed(1),
                type: 'Movie',
                media: 'movie'
            };
        });
        
        return movies;
    } catch (e) {
        console.error('Failed to fetch movies:', e);
        return [];
    }
}

function stripHtml(html) { return (html || '').replace(/<[^>]*>/g, '').trim(); }
function toItem(show) {
    return {
        id: String(show.id),
        title: show.name || 'Untitled',
        overview: stripHtml(show.summary),
        img: (show.image && (show.image.original || show.image.medium)) || FALLBACK_IMG,
        backdrop: (show.image && (show.image.original || show.image.medium)) || '',
        genres: show.genres || [],
        rating: (show.rating && show.rating.average) || 0,
        type: 'TV',
        media: 'tv'
    };
}

async function fetchShowsPage(page = 0) {
    const data = await tvmaze('/shows', { page: String(page) });
    return data.map(toItem);
}

async function fetchAiringToday(country = 'US') {
    const today = new Date().toISOString().slice(0, 10);
    const data = await tvmaze('/schedule', { country, date: today });
    const byId = new Map();
    data.forEach(ep => { if (ep.show) byId.set(ep.show.id, toItem(ep.show)); });
    return Array.from(byId.values());
}

// Local storage helpers for My List (store with media type)
const LS_KEY = 'nf_my_list_v2';
function loadMyList() {
    try {
        const raw = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
        return Array.isArray(raw) ? raw : [];
    } catch { return []; }
}
const saveMyList = (keys) => localStorage.setItem(LS_KEY, JSON.stringify(keys));
const makeKey = (media, id) => `${media}:${id}`;
const inMyList = (media, id) => loadMyList().includes(makeKey(media, id));
const toggleMyList = (media, id) => {
    const key = makeKey(media, id);
    const current = loadMyList();
    const idx = current.indexOf(key);
    if (idx > -1) current.splice(idx, 1); else current.push(key);
    saveMyList(current);
    renderMyList();
};

// DOM helpers
const qs = (s) => document.querySelector(s);
const qsa = (s) => Array.from(document.querySelectorAll(s));
const FALLBACK_IMG = 'https://via.placeholder.com/500x750/222/ffffff?text=No+Image';
const FALLBACK_POSTERS = [
    'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', // Shawshank Redemption
    'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', // The Godfather
    'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', // The Dark Knight
    'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', // Pulp Fiction
    'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', // Forrest Gump
    'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', // Inception
    'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', // The Matrix
    'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg', // Goodfellas
    'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg'  // Titanic
];

function randomPoster(excludeUrl) {
    const pool = FALLBACK_POSTERS.filter(u => u !== excludeUrl);
    return pool[Math.floor(Math.random() * pool.length)] || FALLBACK_IMG;
}

function setRandomFallback(imgEl) {
    const tries = Number(imgEl.dataset.fallbackCount || 0);
    if (tries >= 2) { // after two attempts, use static placeholder
        imgEl.onerror = null;
        imgEl.src = FALLBACK_IMG;
        return;
    }
    imgEl.dataset.fallbackCount = String(tries + 1);
    imgEl.src = randomPoster(imgEl.src);
}

function setHero(item) {
    const bg = qs('#home .hero-bg');
    const title = qs('#hero-title');
    const desc = qs('#hero-desc');
    if (!bg || !title || !desc) return;
    bg.style.backgroundImage = `linear-gradient(180deg, rgba(0,0,0,0.6), rgba(20,20,20,0.95)), url('${item.backdrop || item.img}')`;
    title.textContent = item.title;
    desc.textContent = item.overview;
    const play = qs('#hero-play');
    const more = qs('#hero-more');
    // Play opens in-app trailer player; More opens details modal
    play.onclick = () => simulatePlay(item);
    more.onclick = () => openModalById(item.media, item.id);

    // Light hero background video (stock loop). In a real app this would be a trailer.
    const video = qs('#hero-video');
    if (video) {
        // Use a small, license-friendly looping sample video.
        if (!video.src) {
            video.src = 'https://cdn.coverr.co/videos/coverr-netflix-and-chill-6323/1080p.mp4';
        }
        video.play().catch(() => {/* ignore autoplay block */});
    }
}

function renderRow(title, items) {
    const rows = qs('#rows');
    if (!rows) return;
    const section = document.createElement('section');
    section.className = 'row';
    section.innerHTML = `
        <h2>${title}</h2>
        <div class="row-cards"></div>
    `;
    const scroller = section.querySelector('.row-cards');
    items.forEach(item => scroller.appendChild(createCard(item)));
    rows.appendChild(section);
}

function createCard(item) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${item.img}" alt="${item.title}" loading="lazy">
        <div class="card-overlay">
            <div class="card-title">${item.title}</div>
            <div class="card-actions">
                <button class="btn small" data-action="play" data-id="${item.id}" data-media="${item.media}">▶</button>
                <button class="btn small" data-action="info" data-id="${item.id}" data-media="${item.media}">ℹ</button>
                <button class="btn small" data-action="toggle-list" data-id="${item.id}" data-media="${item.media}">${inMyList(item.media, item.id) ? '✓' : '+'}</button>
            </div>
        </div>
    `;
        const img = card.querySelector('img');
        img.onerror = () => setRandomFallback(img);
    card.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return openModalById(item.media, item.id);
        const action = btn.getAttribute('data-action');
        const media = btn.getAttribute('data-media');
        const id = btn.getAttribute('data-id');
        if (action === 'info') openModalById(media, id);
        if (action === 'play') simulatePlayById(media, id);
        if (action === 'toggle-list') { toggleMyList(media, id); btn.textContent = inMyList(media, id) ? '✓' : '+'; }
        e.stopPropagation();
    });
    return card;
}

function openTrailerSearch(title) {
    const q = encodeURIComponent(`${title} trailer official`);
    // Deprecated: we no longer open a new tab for trailers
    // window.open(`https://www.youtube.com/results?search_query=${q}`, '_blank');
}

async function simulatePlay(item) {
    // Play inside the in-app player modal
    closeModal();
    openPlayer(getTrailerIdFor(item.title));
}

async function simulatePlayById(media, id) {
    const item = await getItemDetails(media, id);
    // Play inside the in-app player modal
    closeModal();
    openPlayer(getTrailerIdFor(item.title));
}

async function openModalById(media, id) {
    const item = await getItemDetails(media, id);
        qs('#modal-image').src = item.img;
        qs('#modal-image').onerror = (e) => setRandomFallback(e.currentTarget);
    qs('#modal-title').textContent = item.title;
    qs('#modal-overview').textContent = item.overview;
    const addBtn = qs('#modal-add');
    addBtn.textContent = inMyList(item.media, item.id) ? '✓ In My List' : '＋ Add to My List';
    addBtn.onclick = () => { toggleMyList(item.media, item.id); addBtn.textContent = inMyList(item.media, item.id) ? '✓ In My List' : '＋ Add to My List'; };
    qs('#modal-play').onclick = () => simulatePlay(item);
        const trailerBtn = qs('#modal-trailer');
        if (trailerBtn) trailerBtn.onclick = async () => {
            // Show trailer in the in-app player modal
            closeModal();
            openPlayer(getTrailerIdFor(item.title));
        };
    
    // Ensure close event listeners are attached every time modal opens
    const closeBtn = qs('#modal-close');
    const backdrop = qs('#modal-backdrop');
    
    // Remove any existing listeners to prevent duplicates
    if (closeBtn) {
        closeBtn.replaceWith(closeBtn.cloneNode(true));
        const newCloseBtn = qs('#modal-close');
        newCloseBtn.addEventListener('click', closeModal);
    }
    
    if (backdrop) {
        backdrop.replaceWith(backdrop.cloneNode(true));
        const newBackdrop = qs('#modal-backdrop');
        newBackdrop.addEventListener('click', closeModal);
    }
    
    // Add keyboard support for Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    const modal = qs('#details-modal');
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
    const modal = qs('#details-modal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
}

async function renderSearch(query) {
    const resultsWrap = qs('#search-results');
    const cards = qs('#search-cards');
    if (!resultsWrap || !cards) return;
    const home = qs('#home');
    const rows = qs('#rows');
    const myListSection = qs('#my-list') || qs('.my-list-section');
    
    if (!query || query.trim().length < 2) {
        resultsWrap.classList.remove('active');
        cards.innerHTML = '';
        // Restore the currently active section when search is cleared
        const activeLink = qs('.nav-links a.active');
        const activeSection = activeLink ? activeLink.getAttribute('href').substring(1) : 'home';
        showSection(activeSection);
        return;
    }
    
    // Hide all main sections while showing search results (like Netflix)
    home && (home.style.display = 'none');
    rows && (rows.style.display = 'none');
    myListSection && (myListSection.style.display = 'none');
    resultsWrap.classList.add('active');
    
    const loading = qs('#app-loading');
    loading && (loading.style.display = 'flex');
    
    try {
        const data = await tvmaze('/search/shows', { q: query });
        const items = (data || []).map(r => toItem(r.show)).filter(Boolean);
        cards.innerHTML = '';
        
        if (items.length > 0) {
            items.forEach(i => cards.appendChild(createCard(i)));
        } else {
            // Enhanced no results message
            cards.innerHTML = `
                <div class="search-no-results">
                    <div class="no-results-icon">😕</div>
                    <h3 class="no-results-title">No results found for "${query}"</h3>
                    <p class="no-results-suggestion">Suggestions:</p>
                    <ul class="no-results-list">
                        <li>Try different keywords</li>
                        <li>Looking for a movie or TV show?</li>
                        <li>Check your spelling</li>
                    </ul>
                </div>
            `;
            resultsWrap.style.display = 'block';
        }
    } catch (e) {
        console.error(e);
        cards.innerHTML = `
            <div class="search-no-results">
                <h3>Search temporarily unavailable</h3>
                <p>Please try again in a moment or browse our content sections.</p>
            </div>
        `;
        resultsWrap.style.display = 'block';
    } finally {
        loading && (loading.style.display = 'none');
    }
}

async function renderMyList() {
    const keys = loadMyList();
    const wrap = qs('#my-list-cards');
    if (!wrap) return;
    wrap.innerHTML = '';
    if (!keys.length) { wrap.innerHTML = '<p class="muted">Your list is empty. Add shows with the ＋ button.</p>'; return; }
    const items = await Promise.all(keys.map(async (k) => {
        const [media, id] = k.split(':');
        try { return await getItemDetails(media, id); } catch { return null; }
    }));
    items.filter(Boolean).forEach(i => wrap.appendChild(createCard(i)));
}

// simple details cache
const detailsCache = new Map();
async function getItemDetails(media, id) {
    const key = `${media}:${id}`;
    if (detailsCache.has(key)) return detailsCache.get(key);
    
    let item;
    if (media === 'tv') {
        const d = await tvmaze(`/shows/${id}`);
        item = toItem(d);
    } else if (media === 'movie') {
        // For movies, extract the title from the ID and get the correct poster
        const idParts = id.split('_');
        const genre = idParts[1] || 'popular';
        const titleIndex = parseInt(idParts[3]) || 0;
        
        // Get the movie list for this genre to find the correct title
        const movies = await fetchMovies(genre, 1);
        const movieData = movies[titleIndex];
        
        if (movieData) {
            item = movieData;
        } else {
            // Fallback if we can't find the movie
            item = {
                id: id,
                title: `Movie ${id}`,
                overview: 'A compelling movie with great story and performances.',
                img: moviePosters[`Movie ${id}`] || FALLBACK_IMG,
                backdrop: moviePosters[`Movie ${id}`] || `https://via.placeholder.com/1280x720/2a2a2a/ffffff?text=Movie+${id}`,
                genres: ['Action', 'Drama'],
                rating: (7 + Math.random() * 3).toFixed(1),
                type: 'Movie',
                media: 'movie'
            };
        }
    }
    
    detailsCache.set(key, item);
    return item;
}

async function renderHome() {
    const rows = qs('#rows');
    if (!rows) return;
    rows.innerHTML = '';
    const loading = qs('#app-loading');
    loading && (loading.style.display = 'flex');
    try {
        const airingToday = await fetchAiringToday('US');
        if (airingToday.length) renderRow('Airing Today', airingToday);

        const pages = await Promise.all([0,1,2].map(p => fetchShowsPage(p)));
        const popular = pages.flat().sort((a,b) => (b.rating||0) - (a.rating||0)).slice(0, 30);
        if (popular.length) {
            setHero(popular[Math.floor(Math.random() * popular.length)]);
            renderRow('Popular on Netflix', popular);
        }

        const genres = ['Drama','Comedy','Action','Science-Fiction','Thriller','Horror'];
        genres.forEach(g => {
            const picks = popular.filter(i => (i.genres||[]).some(x => x.toLowerCase().includes(g.toLowerCase()))).slice(0, 20);
            if (picks.length) renderRow(g, picks);
        });
    } catch (e) {
        console.error(e);
        rows.innerHTML = '<p class="muted" style="padding:1rem;">Failed to load data from TVMaze. Please retry.</p>';
    } finally {
        loading && (loading.style.display = 'none');
    }
}

// Navigation and section management
function setupNavigation() {
    const navLinks = qsa('.nav-links a:not(#my-list-link)');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href').substring(1); // remove #
            
            // Update active state
            qsa('.nav-links a').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show appropriate section
            showSection(href);
            
            // Load content for the section
            loadSectionContent(href);
        });
    });
}

function showSection(sectionName) {
    // Hide all main sections
    const sections = ['home', 'search-results', 'my-list'];
    sections.forEach(name => {
        const section = qs(`#${name}`) || qs(`.${name}-section`) || qs(`.${name}`);
        if (section) section.style.display = 'none';
    });
    
    // Hide hero and rows for non-home sections
    const hero = qs('#home');
    const rows = qs('#rows');
    if (hero) hero.style.display = sectionName === 'home' ? 'block' : 'none';
    if (rows) rows.style.display = sectionName === 'home' || sectionName === 'tv' || sectionName === 'movies' ? 'block' : 'none';
    
    // Show target section
    if (sectionName === 'my-list') {
        const myListSection = qs('#my-list') || qs('.my-list-section');
        if (myListSection) myListSection.style.display = 'block';
    } else if (sectionName === 'home') {
        if (hero) hero.style.display = 'block';
        if (rows) rows.style.display = 'block';
    }
}

async function loadSectionContent(sectionName) {
    const loading = qs('#app-loading');
    
    switch (sectionName) {
        case 'home':
            await renderHome();
            break;
            
        case 'tv':
            loading && (loading.style.display = 'flex');
            try {
                const rows = qs('#rows');
                if (rows) {
                    rows.innerHTML = '';
                    
                    // Load TV-specific content
                    const airingToday = await fetchAiringToday('US');
                    if (airingToday.length) renderRow('Airing Today', airingToday);
                    
                    const pages = await Promise.all([0,1,2].map(p => fetchShowsPage(p)));
                    const allShows = pages.flat();
                    
                    renderRow('Popular TV Shows', allShows.slice(0, 20));
                    renderRow('Drama Series', allShows.filter(s => s.genres.includes('Drama')).slice(0, 20));
                    renderRow('Comedy Series', allShows.filter(s => s.genres.includes('Comedy')).slice(0, 20));
                    renderRow('Sci-Fi & Fantasy', allShows.filter(s => s.genres.some(g => ['Science-Fiction', 'Fantasy'].includes(g))).slice(0, 20));
                }
            } catch (e) {
                console.error('Failed to load TV shows:', e);
            } finally {
                loading && (loading.style.display = 'none');
                // Refresh notifications after loading content
                generateNotifications();
            }
            break;
            
        case 'movies':
            loading && (loading.style.display = 'flex');
            try {
                const rows = qs('#rows');
                if (rows) {
                    rows.innerHTML = '';
                    
                    // Load all different types of movies
                    const movieCategories = [
                        { name: 'Popular Movies', genre: 'popular' },
                        { name: 'Action & Adventure', genre: 'action' },
                        { name: 'Comedy Movies', genre: 'comedy' },
                        { name: 'Drama Movies', genre: 'drama' },
                        { name: 'Horror Movies', genre: 'horror' },
                        { name: 'Sci-Fi Movies', genre: 'scifi' },
                        { name: 'Romance Movies', genre: 'romance' },
                        { name: 'Thriller Movies', genre: 'thriller' },
                        { name: 'Family Movies', genre: 'family' },
                        { name: 'Animated Movies', genre: 'animated' },
                        { name: 'War Movies', genre: 'war' },
                        { name: 'Crime Movies', genre: 'crime' }
                    ];
                    
                    // Load movies for each category
                    for (const category of movieCategories) {
                        const movies = await fetchMovies(category.genre, 1);
                        if (movies.length) {
                            renderRow(category.name, movies);
                        }
                    }
                    
                    // Set a random popular movie as hero for movies section
                    const popularMovies = await fetchMovies('popular', 1);
                    if (popularMovies.length) {
                        setHero(popularMovies[Math.floor(Math.random() * popularMovies.length)]);
                    }
                }
            } catch (e) {
                console.error('Failed to load movies:', e);
                const rows = qs('#rows');
                if (rows) {
                    rows.innerHTML = '<p class="muted" style="padding:1rem;">Failed to load movie content. Please try again.</p>';
                }
            } finally {
                loading && (loading.style.display = 'none');
                // Refresh notifications after loading content
                generateNotifications();
            }
            break;
            
        case 'my-list':
            await renderMyList();
            // Refresh notifications after loading my list
            generateNotifications();
            break;
    }
}

// Generate dynamic notifications with clickable content
async function generateNotifications() {
    const notifMenu = qs('#notif-menu');
    if (!notifMenu) return;
    
    try {
        // Create some predefined notifications with real content that should exist
        const notifications = [];
        
        // Add some TV show notifications with popular shows
        const popularShows = [
            { title: 'Stranger Things', media: 'tv', id: '2' },
            { title: 'The Office', media: 'tv', id: '526' },
            { title: 'Breaking Bad', media: 'tv', id: '1396' },
            { title: 'Money Heist', media: 'tv', id: '71446' },
            { title: 'The Crown', media: 'tv', id: '1399' }
        ];
        
        const popularMovies = [
            { title: 'The Dark Knight', media: 'movie', id: '155' },
            { title: 'Inception', media: 'movie', id: '27205' },
            { title: 'Pulp Fiction', media: 'movie', id: '680' },
            { title: 'The Godfather', media: 'movie', id: '238' },
            { title: 'Forrest Gump', media: 'movie', id: '13' }
        ];
        
        // Randomly select content for notifications
        const randomShow = popularShows[Math.floor(Math.random() * popularShows.length)];
        const randomMovie = popularMovies[Math.floor(Math.random() * popularMovies.length)];
        const trendingShow = popularShows[Math.floor(Math.random() * popularShows.length)];
        
        // Add notifications
        notifications.push({
            type: 'new_episode',
            title: `New Episode Available`,
            content: `${randomShow.title} - Season ${Math.floor(Math.random() * 5) + 1}`,
            item: randomShow,
            icon: '🎬'
        });
        
        notifications.push({
            type: 'recommendation',
            title: 'Recommended for You',
            content: randomMovie.title,
            item: randomMovie,
            icon: '⭐'
        });
        
        notifications.push({
            type: 'trending',
            title: 'Trending Now',
            content: trendingShow.title,
            item: trendingShow,
            icon: '🔥'
        });
        
        // Generate notification HTML
        notifMenu.innerHTML = notifications.map(notif => `
            <div class="notif-item clickable-notif" data-media="${notif.item.media}" data-id="${notif.item.id}">
                <div class="notif-icon">${notif.icon}</div>
                <div class="notif-content">
                    <div class="notif-title">${notif.title}</div>
                    <div class="notif-text">${notif.content}</div>
                </div>
            </div>
        `).join('');
        
        // Add click handlers to notifications
        const clickableNotifs = notifMenu.querySelectorAll('.clickable-notif');
        clickableNotifs.forEach(notif => {
            notif.addEventListener('click', async (e) => {
                e.stopPropagation();
                const media = notif.getAttribute('data-media');
                const id = notif.getAttribute('data-id');
                
                // Close notification menu
                notifMenu.style.display = 'none';
                
                // Open the show/movie modal
                if (media && id) {
                    try {
                        await openModalById(media, id);
                    } catch (error) {
                        console.log('Could not open content:', error);
                        // Fallback: show a simple alert
                        alert(`Opening ${notif.querySelector('.notif-text').textContent}...`);
                    }
                }
            });
        });
        
        // Show notification dot
        const notifDot = qs('#notif-dot');
        if (notifDot) {
            notifDot.style.display = 'block';
        }
        
    } catch (error) {
        console.log('Could not generate notifications:', error);
        // Fallback notifications that don't require API calls
        notifMenu.innerHTML = `
            <div class="notif-item">
                <div class="notif-content">
                    <div class="notif-title">🎬 Welcome to Netflix!</div>
                    <div class="notif-text">Explore thousands of movies and shows</div>
                </div>
            </div>
            <div class="notif-item">
                <div class="notif-content">
                    <div class="notif-title">⭐ Featured Content</div>
                    <div class="notif-text">Check out our trending section</div>
                </div>
            </div>
        `;
    }
}

// Removed credentials banner functionality for privacy

function init() {
    // Auto-fill credentials immediately when init runs
    autoFillLoginForm();
    
    // Refresh credentials button
    const refreshBtn = qs('#refresh-credentials');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', (e) => {
            e.preventDefault();
            autoFillLoginForm();
        });
    }
    
    // Login
    const loginForm = qs('#login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userId = qs('#userId').value;
            const password = qs('#password').value;
            // Demo auth: accept any non-empty credentials
            if (!userId || !password) return;
            
            // Hide login container completely and clear all inline styles
            const loginContainer = qs('#login-container');
            loginContainer.style.cssText = 'display: none !important;';
            
            // Show main content and remove login page class
            qs('#main-content').style.display = 'block';
            document.body.classList.remove('login-page');
            
            // Show credentials below login (persistent banner)
            // intentionally removed: do not display credentials after login
            renderHome();
            renderMyList();
        });
    }

    // Logout
    const logoutBtn = qs('#logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Hide main content and show login
            qs('#main-content').style.display = 'none';
            const loginContainer = qs('#login-container');
            loginContainer.style.display = 'flex';
            loginContainer.style.position = 'fixed';
            loginContainer.style.top = '0';
            loginContainer.style.left = '0';
            loginContainer.style.width = '100vw';
            loginContainer.style.height = '100vh';
            loginContainer.style.zIndex = '1000';
            document.body.classList.add('login-page');
            
            // Reset login form and regenerate credentials
            if (loginForm) {
                loginForm.reset();
                generateRandomCredentials(); // Generate new random credentials
            }
            
            // Clear search state
            const input = qs('#search-input');
            if (input) {
                input.value = '';
                renderSearch('');
            }
            
            // Close profile menu
            const profileMenu = qs('#profile-menu');
            if (profileMenu) {
                profileMenu.style.display = 'none';
            }
            
            // Reset to home section when user logs in again
            window.location.hash = '#home';
            
            // Clear any notification states
            const notifMenu = qs('#notif-menu');
            if (notifMenu) {
                notifMenu.style.display = 'none';
            }
        });
    }

    // Enhanced Search with visual improvements
    const searchInput = qs('#search-input');
    const searchIcon = qs('#search-icon');
    const searchClear = qs('#search-clear');
    
    if (searchInput && searchIcon && searchClear) {
        const debounce = (fn, ms) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); }; };
        const doSearch = (val) => {
            const query = String(val || '').trim();
            
            // Show/hide clear button
            if (query.length > 0) {
                searchClear.classList.add('show');
                searchIcon.style.display = 'none';
            } else {
                searchClear.classList.remove('show');
                searchIcon.style.display = 'block';
            }
            
            renderSearch(query);
        };
        
        // Input event with debounce
        searchInput.addEventListener('input', debounce((e) => {
            doSearch(e.target.value);
        }, 250));
        
        // Keyboard shortcuts
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                doSearch(searchInput.value);
                const wrap = qs('#search-results');
                wrap && wrap.scrollIntoView({ behavior: 'smooth' });
            } else if (e.key === 'Escape') {
                searchInput.value = '';
                doSearch('');
                searchInput.blur();
            }
        });
        
        // Clear button functionality
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            doSearch('');
            searchInput.focus();
        });
        
        // Focus behavior
        searchInput.addEventListener('focus', () => {
            if (searchInput.value && searchInput.value.trim().length >= 2) {
                doSearch(searchInput.value);
            }
        });
        
        // Initial state
        doSearch(searchInput.value);
    }

    // Modal close
    const closeBtn = qs('#modal-close');
    const backdrop = qs('#modal-backdrop');
    closeBtn && closeBtn.addEventListener('click', closeModal);
    backdrop && backdrop.addEventListener('click', closeModal);

    // Surprise me
        const randomBtn = qs('#random-movie-btn');
    if (randomBtn) {
        randomBtn.addEventListener('click', () => {
                const loading = qs('#app-loading');
                if (loading) loading.style.display = 'flex';
                setTimeout(() => {
                    // Try to pick from currently rendered cards
                    const cards = qsa('.row .card');
                    if (cards.length) {
                        const pick = cards[Math.floor(Math.random() * cards.length)];
                        const infoBtn = pick.querySelector('button[data-action="info"]');
                        if (infoBtn) openModalById(infoBtn.getAttribute('data-media'), infoBtn.getAttribute('data-id'));
                    }
                    if (loading) loading.style.display = 'none';
                }, 500);
        });
    }

    // Navigation routing
    setupNavigation();

    // My List link (keep existing behavior)
    const myListLink = qs('#my-list-link');
    if (myListLink) {
        myListLink.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('my-list');
            renderMyList();
            document.getElementById('my-list').scrollIntoView({ behavior: 'smooth' });
        });
    }

        // Profile menu toggle
        const profile = qs('#profile');
        const profileMenu = qs('#profile-menu');
        if (profile && profileMenu) {
            profile.addEventListener('click', (e) => {
                e.stopPropagation();
                profileMenu.style.display = profileMenu.style.display === 'none' ? 'block' : 'none';
            });
            document.addEventListener('click', () => { profileMenu.style.display = 'none'; });
        }

            // Hamburger / mobile nav
            const hamburger = qs('#hamburger');
            const navLinks = qs('#nav-links');
            if (hamburger && navLinks) {
                hamburger.addEventListener('click', () => {
                    const show = !navLinks.classList.contains('show');
                    navLinks.classList.toggle('show', show);
                    hamburger.setAttribute('aria-expanded', String(show));
                });
            }

            // Notifications dropdown
            const notifBtn = qs('#notif-btn');
            const notifMenu = qs('#notif-menu');
            const notifDot = qs('#notif-dot');
            if (notifBtn && notifMenu) {
                // Generate dynamic notifications
                generateNotifications();
                
                notifBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const visible = notifMenu.style.display !== 'none';
                    notifMenu.style.display = visible ? 'none' : 'block';
                    notifBtn.setAttribute('aria-expanded', String(!visible));
                    if (notifDot) notifDot.style.display = 'none';
                });
                document.addEventListener('click', () => { notifMenu.style.display = 'none'; });
            }

            // Topnav background on scroll (subtle darkening)
            const topnav = qs('#topnav');
            if (topnav) {
                const onScroll = () => {
                    topnav.style.background = window.scrollY > 10
                        ? 'rgba(20,20,20,0.98)'
                        : 'linear-gradient(180deg, rgba(20,20,20,0.95), rgba(20,20,20,0.5), transparent)';
                };
                window.addEventListener('scroll', onScroll, { passive: true });
                onScroll();
            }
}

// Initialize on DOM ready (script is at the end of body; still guard for safety)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Ensure login background on first load
document.body.classList.add('login-page');

// Generate random dummy credentials for demo
function generateRandomCredentials() {
    const firstNames = ['john', 'sarah', 'mike', 'emma', 'david', 'lisa', 'alex', 'maria', 'chris', 'anna'];
    const lastNames = ['smith', 'johnson', 'brown', 'davis', 'wilson', 'garcia', 'miller', 'taylor', 'anderson', 'thomas'];
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const randomNum = Math.floor(Math.random() * 999) + 1;
    
    const email = `${firstName}.${lastName}${randomNum}@${domain}`;
    const password = `Pass${Math.floor(Math.random() * 9000) + 1000}!`;
    
    return { email, password };
}

// Auto-fill login form with random credentials
function autoFillLoginForm() {
    const userIdField = qs('#userId');
    const passwordField = qs('#password');
    
    if (userIdField && passwordField) {
        const credentials = generateRandomCredentials();
        userIdField.value = credentials.email;
        passwordField.value = credentials.password;
        
        // Add a subtle animation to show it's been auto-filled
        userIdField.style.backgroundColor = '#e8f5e8';
        passwordField.style.backgroundColor = '#e8f5e8';
        
        setTimeout(() => {
            userIdField.style.backgroundColor = '';
            passwordField.style.backgroundColor = '';
        }, 2000);
    }
}

// Auto-fill credentials when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(autoFillLoginForm, 500); // Small delay to ensure form is ready
    });
} else {
    setTimeout(autoFillLoginForm, 500);
}

// Trailer player controls
function openPlayer(youtubeId) {
    const modal = qs('#player-modal');
    const frame = qs('#yt-frame');
    if (!modal || !frame) return;
    const src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;
    frame.src = src;
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
}
function closePlayer() {
    const modal = qs('#player-modal');
    const frame = qs('#yt-frame');
    if (!modal || !frame) return;
    frame.src = '';
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
}
const playerBackdrop = document.getElementById('player-backdrop');
const playerClose = document.getElementById('player-close');
playerBackdrop && playerBackdrop.addEventListener('click', closePlayer);
playerClose && playerClose.addEventListener('click', closePlayer);

// Very small heuristic mapper for trailer IDs; falls back to a safe default video
function getTrailerIdFor(title) {
    const map = {
        // Example known pairs (IDs are public YouTube video IDs)
        'Stranger Things': 'b9EkMc79ZSU',
        'Money Heist': 'ZAXA1DV4dtI',
        'The Witcher': 'ndl1W4ltcmg',
        'Breaking Bad': 'HhesaQXLuRY',
        'Dark': 'rrwycJ08PSA',
        'Squid Game': 'oqxAJKy0ii4',
        'Extraction': 'L6P3nI6VnlY',
        'The Gray Man': 'BmllggGO4pM',
        'Red Notice': 'Pj0wz7zu3Ms'
    };
    const key = Object.keys(map).find(k => title && title.toLowerCase().includes(k.toLowerCase()));
    if (key) return map[key];
    // Fallback to a Creative Commons sample video (Big Buck Bunny)
    return 'aqz-KE-bpKQ';
}
