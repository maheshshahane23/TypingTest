$(document).ready(function() {
    const textDisplay = $('#text-display');
    const inputArea = $('#input-area');
    const timer = $('#timer');
    const startButton = $('#start-test');
    const restartButton = $('#restart-test');
    const resultPopup = $('#result-popup');
    const wpmResult = $('#wpm-result');
    const greetingMessage = $('#greeting-message');
    const encouragingMessage = $('#encouraging-message');
    const resultGif = $('#result-gif');

    let currentText = '';
    let timeLeft = 0;
    let timerInterval;
    let startTime;
    let correctCharacters = 0;
    let totalCharacters = 0;
    let timerStarted = false;

    // Add these new variables for the audio context and sound
    let audioContext;
    let isAudioInitialized = false;

    let consecutiveErrors = 0;
    const maxConsecutiveErrors = 10;

    // Add these new GIFs for the error situation
    const errorGifs = [
        "https://media.giphy.com/media/3o7btNa0RUYa5E7iiQ/giphy.gif", // Confused typing
        "https://media.giphy.com/media/xT9IgIc0lryrxvqVGM/giphy.gif", // Facepalm
        "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif", // Homer Simpson disappearing
        "https://media.giphy.com/media/l1J9EdzfOSgfyueLm/giphy.gif", // Confused math lady
        "https://media.giphy.com/media/l41lFw057lAJQMwg0/giphy.gif"  // Stressed out
    ];

    const paragraphs = {
        easy: [
            "The sun rose slowly over the horizon, painting the sky in shades of pink and orange. Birds began to chirp, welcoming the new day with their cheerful songs. A gentle breeze rustled through the leaves of nearby trees, carrying the sweet scent of blooming flowers. In the distance, a dog barked, breaking the peaceful silence of the morning. As the world awakened, people started to emerge from their homes, ready to face whatever challenges the day might bring.",
            "She walked along the beach, feeling the warm sand between her toes. The sound of crashing waves filled her ears, and the salty air tickled her nose. Seagulls soared overhead, their cries echoing across the shoreline. She bent down to pick up a smooth, colorful seashell, admiring its intricate patterns. As the sun began to set, the sky transformed into a canvas of vibrant colors, reflecting off the calm ocean waters.",
            "The old bookstore stood on the corner, its windows dusty and filled with stacks of well-worn novels. Inside, the smell of aged paper and leather bindings filled the air. Shelves stretched from floor to ceiling, packed with books of every genre imaginable. In a cozy corner, a group of children sat cross-legged on the floor, listening intently as the shopkeeper read aloud from a fairy tale. The soft glow of antique lamps cast a warm light over the scene, creating a magical atmosphere.",
            "The garden was a riot of color, with flowers of every hue blooming in neat rows. Bees buzzed from blossom to blossom, their legs heavy with pollen. A stone path wound its way through the beds, leading to a small pond where water lilies floated serenely. In the center of the garden stood an old apple tree, its branches laden with ripe fruit. A wooden bench beneath the tree provided the perfect spot for visitors to sit and enjoy the peaceful surroundings.",
            "The aroma of freshly baked bread wafted through the air, drawing customers into the small bakery. Behind the counter, bakers kneaded dough and shaped loaves with practiced hands. Display cases were filled with an array of pastries, cakes, and cookies, each one a work of art. The sound of the bell above the door chimed constantly as people came and went, leaving with paper bags filled with warm, delicious treats.",
            "The playground echoed with the sound of children's laughter. Swings creaked as kids soared higher and higher, their feet kicking at the sky. On the slide, a line of eager faces waited for their turn to whoosh down to the ground. In the sandbox, castles and moats took shape under small, determined hands. Parents watched from nearby benches, smiling at the joyful scene before them.",
            "The farmer's market bustled with activity on a sunny Saturday morning. Stalls lined the street, offering fresh produce, homemade jams, and artisanal cheeses. The air was filled with the mingled scents of ripe strawberries, fragrant herbs, and freshly baked pies. Shoppers wandered from booth to booth, filling their baskets with colorful fruits and vegetables. Local musicians played cheerful tunes, adding to the lively atmosphere.",
            "The old clock tower stood tall in the center of the town square, its face visible from every corner. Pigeons roosted in its eaves, cooing softly as people passed below. The clock's deep chimes marked the hours, a familiar sound that had echoed through the streets for generations. Around the base of the tower, flower beds bloomed in vibrant colors, tended lovingly by the town's gardeners.",
            "The library was a haven of quiet on a rainy afternoon. Rows of bookshelves stretched as far as the eye could see, filled with volumes on every subject imaginable. Soft lamplight illuminated reading nooks where visitors sat absorbed in their chosen books. The gentle patter of rain against the windows created a soothing backdrop to the rustle of turning pages and the occasional whisper of a librarian helping a patron.",
            "The small cafe on the corner was a favorite spot for locals and tourists alike. The aroma of freshly ground coffee beans filled the air, mingling with the scent of baking pastries. Baristas worked efficiently behind the counter, creating intricate latte art and serving up steaming mugs of tea. At the tables, friends chatted over breakfast, while others tapped away on laptops, enjoying the cozy atmosphere.",
            "The community garden was a patchwork of small plots, each one tended with care by neighborhood residents. Tomato plants heavy with fruit stood tall next to rows of crisp lettuce and fragrant herbs. A scarecrow watched over a patch of ripening pumpkins, its straw-stuffed arms outstretched. At the garden's edge, a composting area turned kitchen scraps into rich soil, ready to nourish next season's crops.",
            "The antique shop was a treasure trove of curiosities from bygone eras. Ornate mirrors and weathered picture frames hung on the walls, reflecting the soft glow of vintage lamps. Glass cases displayed delicate jewelry and pocket watches, their hands frozen in time. In one corner, a gramophone stood ready to play, its brass horn gleaming in the dim light. Every shelf and surface held items with stories to tell, waiting for new owners to appreciate their history.",
            "The local diner was a slice of Americana, with its chrome-edged counter and red vinyl booths. The clatter of plates and the sizzle of the grill provided a constant backdrop to the chatter of regulars. Waitresses moved efficiently between tables, balancing trays laden with comfort food classics. The aroma of fresh coffee and sizzling bacon filled the air, making mouths water and stomachs growl in anticipation.",
            "The old train station had been converted into a museum, preserving the town's railway history. Vintage locomotives stood on display, their once-shiny surfaces now weathered with age. Inside the former waiting room, exhibits showcased old tickets, conductor uniforms, and black-and-white photographs of the station in its heyday. The ticket counter now served as an information desk, where visitors could learn about the important role the railway had played in the town's development.",
            "The botanical gardens were a peaceful oasis in the heart of the city. Winding paths led visitors through different themed areas, from a tranquil Japanese garden to a colorful butterfly house. The greenhouse was filled with exotic plants from around the world, their leaves creating a lush green canopy overhead. Near the center of the gardens, a small cafe offered refreshments, allowing visitors to relax and enjoy the beautiful surroundings."
        ],
        medium: [
            "The ancient ruins stood silently, a testament to a long-forgotten civilization. Intricate carvings adorned the weathered stone walls, telling stories of gods and heroes from ages past. Archaeologists carefully excavated the site, hoping to uncover secrets hidden beneath layers of earth and time. Each artifact they discovered provided a small piece of the puzzle, slowly revealing the history of this mysterious place. As the sun set, casting long shadows across the excavation, the team packed up their tools, eager to return and continue their work the next day.",
            "The art gallery buzzed with excitement on opening night of the new exhibition. Paintings and sculptures from contemporary artists filled the spacious rooms, each piece a unique expression of creativity. Visitors moved from one artwork to another, engaged in hushed conversations about technique, symbolism, and emotional impact. In one corner, the artist herself stood nervously, watching as people reacted to her creations. The clinking of champagne glasses and the soft strains of classical music added to the sophisticated atmosphere of the event.",
            "The research laboratory was a hive of activity, with scientists in white coats moving purposefully between workstations. Microscopes hummed as researchers examined slides containing potential breakthrough discoveries. In one section, a team huddled around a computer, analyzing data from their latest experiment. The air was filled with a mix of anticipation and concentration, as each person worked towards advancing human knowledge in their chosen field. Whiteboards covered in complex equations and diagrams lined the walls, testament to the ongoing pursuit of scientific understanding.",
            "The courtroom fell silent as the judge entered, all rising to their feet in a show of respect. Lawyers on both sides shuffled papers and whispered last-minute instructions to their clients. The jury filed in, their faces unreadable as they took their seats. As the trial began, the air grew tense with the weight of the proceedings. Each witness was called to the stand, sworn in, and questioned, their testimonies potentially tipping the scales of justice one way or the other. Outside, reporters waited eagerly for any news, ready to broadcast the outcome to the world.",
            "The symphony orchestra tuned their instruments, creating a cacophony of sounds that gradually melded into perfect harmony. The conductor stepped onto the podium, baton raised, and a hush fell over the audience. With a graceful movement, the music began, filling the concert hall with rich, complex melodies. Violins soared above the deeper tones of cellos and bass, while woodwinds and brass added color and texture to the piece. In the front row, a young music student watched in awe, dreaming of the day she might take her place on that stage.",
            "The emergency room was a flurry of controlled chaos as ambulances arrived with new patients. Doctors and nurses moved swiftly between beds, assessing injuries and providing immediate care. Monitors beeped steadily, tracking vital signs of those in critical condition. In one corner, a worried family waited for news of their loved one, while nearby, a child was being comforted after receiving stitches. Despite the high-stress environment, the medical staff worked with calm efficiency, their years of training evident in every action.",
            "The film set was alive with activity as crew members prepared for the next scene. Lighting technicians adjusted enormous lamps, while makeup artists touched up the actors' faces. The director huddled with the cinematographer, discussing camera angles and movement. Nearby, the sound team checked microphones and monitored audio levels. As the assistant director called for quiet on the set, a hush fell over the area. The clapperboard snapped shut, and the actors began their performance, bringing the script to life before the rolling cameras.",
            "The busy kitchen of the five-star restaurant operated like a well-oiled machine. Chefs called out orders as they expertly prepared dishes, their knives flashing as they chopped and diced ingredients. The sous chef tasted sauces, adjusting seasonings with a discerning palate. Waitstaff hurried in and out, collecting plates of beautifully presented food to deliver to eager diners. In the dining room, sommelier recommended wine pairings, enhancing the culinary experience for the restaurant's patrons. The entire establishment hummed with energy, each person playing their part in creating an unforgettable dining experience.",
            "The robotics competition arena was filled with the sounds of whirring motors and excited chatter. Teams of high school students made last-minute adjustments to their creations, testing sensors and checking code. Judges walked among the tables, asking questions and taking notes on clipboards. In the center of the room, a complex obstacle course waited to challenge the robots' capabilities. Parents and teachers watched from the sidelines, offering encouragement and support to the young engineers. As the first round began, a mix of nerves and excitement filled the air, with each team hoping their hard work would pay off.",
            "The bustling newsroom was a hive of activity as reporters raced to meet their deadlines. Phones rang constantly, and the clatter of keyboards filled the air as stories took shape. Editors huddled in glass-walled offices, discussing the layout of tomorrow's front page. Breaking news alerts flashed across screens, sending journalists scrambling to cover the latest developments. In one corner, a group debated the ethics of a controversial story, weighing public interest against potential consequences. Despite the digital age, the energy of the traditional newsroom remained, driven by the pursuit of truth and the power of information.",
            "The courtyard of the medieval castle was alive with the sights and sounds of a historical reenactment. Actors in period costumes demonstrated traditional crafts, from blacksmithing to weaving. The aroma of roasting meat wafted from a spit over an open fire, while minstrels played lively tunes on authentic instruments. Visitors wandered among the displays, asking questions and marveling at the glimpse into life from centuries past. In the great hall, a mock feast was being prepared, complete with period-appropriate table settings and menu items. The entire event brought history to life, allowing people to step back in time and experience a bygone era.",
            "The state-of-the-art space center buzzed with excitement as final preparations were made for the upcoming launch. Engineers pored over computer screens, double-checking every system and subsystem. In the astronaut quarantine area, the crew went through their final briefings, their faces a mix of focus and anticipation. Outside, the massive rocket stood on the launchpad, fueling operations underway. Media from around the world had gathered to witness the historic event, cameras trained on the spacecraft that would soon journey beyond Earth's atmosphere. As the countdown began, a sense of awe fell over everyone present, reminded of the incredible feat of human ingenuity they were about to witness.",
            "The fashion show backstage was a whirlwind of activity moments before the runway presentation began. Makeup artists and hairstylists worked their magic on models, creating the perfect looks to complement the designer's vision. Seamstresses made last-minute alterations to garments, ensuring each piece fit flawlessly. The designer herself moved from station to station, checking details and offering words of encouragement to her team. As music began to pulse through the speakers, models lined up in their first outfits, ready to showcase the collection to the eagerly waiting audience. The air crackled with a mixture of nerves and excitement, as months of hard work culminated in this moment.",
            "The trading floor of the stock exchange was a cacophony of shouts and rapid-fire conversations. Traders stared intently at multiple screens, tracking market movements and making split-second decisions. Phones rang constantly as clients called in with orders or seeking advice. The electronic ticker tape scrolled endlessly, displaying a constant stream of stock prices and market data. In one corner, a team huddled around a desk, strategizing their approach to a major IPO. The atmosphere was charged with energy, fortunes potentially made or lost with each transaction. Despite the rise of electronic trading, the human element remained crucial, with experience and instinct playing key roles in navigating the complex world of finance.",
            "The animal rehabilitation center was a haven for injured and orphaned wildlife. In one enclosure, a young deer was learning to walk on a healing leg, while nearby, a group of raccoons playfully explored their temporary home. Veterinarians moved from case to case, providing medical care and monitoring the progress of their patients. Volunteers prepared specialized diets and cleaned habitats, ensuring the comfort and health of the animals. In the nursery, staff members bottle-fed orphaned squirrels and rabbits, providing the care they would have received from their mothers in the wild. The entire facility was dedicated to one goal: returning these creatures to their natural habitats, healthy and able to thrive."
        ],
        hard: [
            "The quantum computer hummed softly, its superconducting circuits cooled to near absolute zero. Scientists gathered around the machine, their faces a mixture of excitement and apprehension. They were about to run an algorithm that could potentially solve problems deemed impossible by classical computers. As the program initiated, streams of data flowed through the qubits, performing calculations at an astounding rate. The researchers held their breath, knowing that the results of this experiment could revolutionize fields ranging from cryptography to drug discovery. Suddenly, the computer beeped, signaling the end of the computation.",
            "The international space station orbited silently above the Earth, a testament to human ingenuity and cooperation. Inside, astronauts from various countries worked tirelessly on experiments that could only be conducted in microgravity. One team focused on crystal growth, while another studied the effects of space radiation on living organisms. In the cupola, a geologist marveled at the ever-changing face of the planet below, documenting weather patterns and geological phenomena. Despite the cramped quarters and challenging conditions, each crew member felt privileged to contribute to humanity's understanding of the universe and our place within it.",
            "The neurosurgeon peered through the microscope, her skilled hands guiding instruments with millimeter precision. The patient's brain lay exposed, its intricate folds and valleys a roadmap of human consciousness. With each careful movement, the surgeon navigated between critical areas, removing the tumor while preserving vital functions. Monitors beeped steadily, tracking the patient's vital signs, while the anesthesiologist kept a watchful eye on sedation levels. In the observation room, medical students watched in awe, witnessing the delicate dance between science and skill that could mean the difference between life and death.",
            "The particle accelerator stretched for miles underground, a marvel of modern physics. Scientists from around the world gathered in the control room, eagerly awaiting the results of their latest experiment. As subatomic particles were accelerated to near-light speeds and made to collide, detectors captured the resulting shower of exotic particles. Each collision had the potential to reveal new insights into the fundamental nature of matter and energy. The air was thick with anticipation as data began to stream in, potentially rewriting textbooks and challenging our understanding of the universe.",
            "The cybersecurity command center was a hive of activity as analysts tracked a sophisticated hacking attempt in real-time. Screens displayed network traffic patterns and intrusion detection alerts, while teams of experts worked to identify the attackers and mitigate the threat. The stakes were high, with critical infrastructure and sensitive data hanging in the balance. As the attack evolved, the defenders adapted their strategies, engaging in a high-stakes digital chess game against an unseen adversary. The room buzzed with tense communication as each team member played their part in safeguarding the nation's digital assets.",
            "The gene editing laboratory was at the forefront of CRISPR technology, pushing the boundaries of what was possible in genetic manipulation. Researchers carefully pipetted microscopic samples, their work potentially holding the key to curing genetic diseases or enhancing human capabilities. Ethical discussions were as frequent as scientific ones, with the team constantly weighing the potential benefits against the risks of altering the human genome. As a breakthrough experiment neared completion, the scientists knew their work could have profound implications for the future of medicine and human evolution.",
            "The deep-sea exploration vehicle descended into the abyss, its powerful lights illuminating a world few humans had ever seen. Marine biologists crowded around viewing ports, documenting bizarre and beautiful creatures that defied imagination. The ship's advanced sonar mapped the contours of underwater mountains and canyons, while robotic arms collected samples from hydrothermal vents. As the pressure increased with depth, the team marveled at the engineering that allowed them to explore this alien environment on our own planet, each discovery adding to our understanding of Earth's last great frontier.",
            "The renewable energy research facility was a showcase of cutting-edge technology in the fight against climate change. Solar panels and wind turbines dotted the landscape, while inside, scientists worked on next-generation battery storage and fusion reactors. In one lab, a team tested new photovoltaic materials that could dramatically increase solar efficiency. Nearby, engineers fine-tuned smart grid systems designed to optimize energy distribution. The entire complex was a testament to human ingenuity and the race to develop sustainable energy solutions before it's too late for our planet.",
            "The virtual reality development studio was pushing the boundaries of immersive technology. Programmers and artists collaborated to create hyper-realistic environments that engaged all the senses. Test subjects donned advanced haptic suits and neural interfaces, their brains convinced they were experiencing alternate realities. The potential applications ranged from revolutionary educational tools to groundbreaking therapeutic techniques for treating PTSD and phobias. As the line between the virtual and physical worlds blurred, the team grappled with the ethical implications of creating experiences indistinguishable from reality.",
            "The bioengineering laboratory was at the forefront of synthetic biology, creating artificial organisms with custom-designed DNA. Researchers carefully manipulated genes to produce microbes capable of cleaning up oil spills or producing life-saving drugs. The air hummed with the sound of centrifuges and PCR machines, while computer models simulated the behavior of these engineered life forms. As the team worked to create a completely synthetic genome, they were acutely aware of the power and responsibility that came with playing the role of nature's architect.",
            "The autonomous vehicle testing facility was a miniature city, complete with complex intersections, unpredictable pedestrians, and challenging weather conditions. Engineers monitored banks of computers as self-driving cars navigated the course, their AI systems making split-second decisions. In the simulation room, virtual scenarios pushed the limits of the vehicles' capabilities, preparing them for every conceivable situation they might encounter on real roads. As the technology neared perfection, discussions turned to the societal impacts of widespread adoption, from changes in urban planning to the ethical dilemmas of algorithmic decision-making in potential accident scenarios.",
            "The climate modeling supercomputer facility housed some of the most powerful machines on the planet, dedicated to predicting the future of Earth's ecosystem. Climatologists input vast amounts of data from satellites, weather stations, and historical records, creating increasingly accurate models of global weather patterns and long-term climate trends. The hum of cooling systems was constant as the computers crunched through petabytes of information, simulating centuries of climate evolution in a matter of hours. The results of these simulations would inform policy decisions and adaptation strategies for generations to come, highlighting the critical role of computational science in addressing global challenges.",
            "The virtual reality development studio was pushing the boundaries of immersive technology. Programmers and artists collaborated to create hyper-realistic environments that engaged all the senses. Test subjects donned advanced haptic suits and neural interfaces, their brains convinced they were experiencing alternate realities. The potential applications ranged from revolutionary educational tools to groundbreaking therapeutic techniques for treating PTSD and phobias. As the line between the virtual and physical worlds blurred, the team grappled with the ethical implications of creating experiences indistinguishable from reality.",
            "The bioengineering laboratory was at the forefront of synthetic biology, creating artificial organisms with custom-designed DNA. Researchers carefully manipulated genes to produce microbes capable of cleaning up oil spills or producing life-saving drugs. The air hummed with the sound of centrifuges and PCR machines, while computer models simulated the behavior of these engineered life forms. As the team worked to create a completely synthetic genome, they were acutely aware of the power and responsibility that came with playing the role of nature's architect.",
            "The autonomous vehicle testing facility was a miniature city, complete with complex intersections, unpredictable pedestrians, and challenging weather conditions. Engineers monitored banks of computers as self-driving cars navigated the course, their AI systems making split-second decisions. In the simulation room, virtual scenarios pushed the limits of the vehicles' capabilities, preparing them for every conceivable situation they might encounter on real roads. As the technology neared perfection, discussions turned to the societal impacts of widespread adoption, from changes in urban planning to the ethical dilemmas of algorithmic decision-making in potential accident scenarios.",
            "The climate modeling supercomputer facility housed some of the most powerful machines on the planet, dedicated to predicting the future of Earth's ecosystem. Climatologists input vast amounts of data from satellites, weather stations, and historical records, creating increasingly accurate models of global weather patterns and long-term climate trends. The hum of cooling systems was constant as the computers crunched through petabytes of information, simulating centuries of climate evolution in a matter of hours. The results of these simulations would inform policy decisions and adaptation strategies for generations to come, highlighting the critical role of computational science in addressing global challenges."
        ]
    };

    const resultGifs = [
        "https://media.giphy.com/media/3o7btXkbsV26U95Uly/giphy.gif",
        "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif",
        "https://media.giphy.com/media/l3q2Z6S6n38zjPswo/giphy.gif",
        "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
        "https://media.giphy.com/media/3o7abGQa0aRJUurpII/giphy.gif",
        // 15 new GIFs
        "https://media.giphy.com/media/26ufnwz3wDUli7GU0/giphy.gif", // Typing cat
        "https://media.giphy.com/media/XIqCQx02E1U9W/giphy.gif", // Fast typing
        "https://media.giphy.com/media/5wWf7H89PisM6An8UAU/giphy.gif", // Typing on fire
        "https://media.giphy.com/media/10zxDv7Hv5RF9C/giphy.gif", // Monkey typing
        "https://media.giphy.com/media/l0HlNaQ6gWfllcjDO/giphy.gif", // Typewriter
        "https://media.giphy.com/media/l0HlQXlQ3nHyLMvte/giphy.gif", // Muppet typing
        "https://media.giphy.com/media/dlMIwDQAxXn1K/giphy.gif", // Spongebob typing
        "https://media.giphy.com/media/o0vwzuFwCGAFO/giphy.gif", // Jim Carrey typing
        "https://media.giphy.com/media/gLcUG7QiR0jpMzoNUu/giphy.gif", // Dog typing
        "https://media.giphy.com/media/LmNwrBhejkK9EFP504/giphy.gif", // Typing fail
        "https://media.giphy.com/media/KyGiMJokZEQvu/giphy.gif", // Homer Simpson typing
        "https://media.giphy.com/media/13GIgrGdslD9oQ/giphy.gif", // Ron Swanson typing
        "https://media.giphy.com/media/ule4vhcY1xEKQ/giphy.gif", // Typing machine
        "https://media.giphy.com/media/l0IykG0AM7911MrCM/giphy.gif", // Stressed typing
        "https://media.giphy.com/media/citBl9yPwnUOs/giphy.gif" // Typing fingers
    ];

    function getRandomParagraph(difficulty) {
        return paragraphs[difficulty][Math.floor(Math.random() * paragraphs[difficulty].length)];
    }

    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timer.text(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            endTest();
        }
    }

    function startTest() {
        const duration = parseInt($('#duration').val());
        const difficulty = $('#difficulty').val();

        timeLeft = duration;
        currentText = getRandomParagraph(difficulty);
        textDisplay.html(currentText.split('').map(char => `<span>${char}</span>`).join(''));
        inputArea.text('').attr('contenteditable', 'true').focus();
        startButton.prop('disabled', true);
        restartButton.removeClass('hidden');
        resultPopup.addClass('hidden');
        timer.text(`${Math.floor(duration / 60).toString().padStart(2, '0')}:${(duration % 60).toString().padStart(2, '0')}`);
        timerStarted = false;
        correctCharacters = 0;
        totalCharacters = 0;
        consecutiveErrors = 0; // Reset the consecutive errors counter
    }

    function endTest(isError = false) {
        inputArea.attr('contenteditable', 'false');
        startButton.prop('disabled', false);
        clearInterval(timerInterval);

        const endTime = new Date().getTime();
        const timeElapsed = (endTime - startTime) / 60000; // in minutes
        const wordsTyped = correctCharacters / 5; // assuming average word length of 5 characters
        const wpm = Math.round(wordsTyped / timeElapsed);
        const accuracy = Math.round((correctCharacters / totalCharacters) * 100);

        if (isError) {
            wpmResult.text("Oops! Looks like you had a bit of trouble there.");
            greetingMessage.text("Don't worry, it happens to the best of us!");
            encouragingMessage.text("Why not take a deep breath and give it another shot?");
            resultGif.attr('src', errorGifs[Math.floor(Math.random() * errorGifs.length)]);
        } else {
            wpmResult.text(`Your typing speed: ${wpm} WPM`);
            greetingMessage.text(`Accuracy: ${accuracy}%`);
            encouragingMessage.text(getEncouragingMessage());
            resultGif.attr('src', getRandomResultGif());
        }

        resultPopup.removeClass('hidden');
    }

    function getGreetingMessage(wpm) {
        if (wpm < 30) return "Nice effort! Keep practicing!";
        if (wpm < 50) return "Good job! You're making progress!";
        if (wpm < 70) return "Great typing speed! You're above average!";
        if (wpm < 90) return "Wow! You're a fast typer!";
        return "Incredible! You're a typing master!";
    }

    function getEncouragingMessage() {
        const messages = [
            "Remember, practice makes perfect!",
            "Keep up the good work!",
            "You're improving with every test!",
            "Believe in yourself and keep pushing forward!",
            "Your dedication will pay off!"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    function getRandomResultGif() {
        return resultGifs[Math.floor(Math.random() * resultGifs.length)];
    }

    // Add this new function to create and play the sound
    function playErrorSound() {
        if (!isAudioInitialized) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            isAudioInitialized = true;
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    inputArea.on('input', function(e) {
        if (!timerStarted) {
            timerStarted = true;
            startTime = new Date().getTime();
            timerInterval = setInterval(updateTimer, 1000);
            startButton.prop('disabled', true);
        }

        const inputText = $(this).text();
        const textSpans = textDisplay.find('span');

        textSpans.removeClass('correct incorrect current');

        for (let i = 0; i < inputText.length; i++) {
            if (i >= totalCharacters) {
                totalCharacters++;
                if (inputText[i] === currentText[i]) {
                    correctCharacters++;
                    consecutiveErrors = 0;
                } else {
                    // Only play error sound if the character is incorrect and not a space
                    if (currentText[i] !== ' ') {
                        playErrorSound();
                    }
                    consecutiveErrors++;
                    if (consecutiveErrors >= maxConsecutiveErrors) {
                        endTest(true);
                        return;
                    }
                }
            }
            if (inputText[i] === currentText[i]) {
                $(textSpans[i]).addClass('correct');
            } else {
                $(textSpans[i]).addClass('incorrect');
            }
        }

        if (inputText.length < currentText.length) {
            $(textSpans[inputText.length]).addClass('current');
        }

        // Prevent line breaks
        if (e.originalEvent.inputType === 'insertParagraph') {
            e.preventDefault();
            document.execCommand('insertText', false, ' ');
            return false;
        }
    });

    // Ensure the input-area is not editable until the test starts
    inputArea.attr('contenteditable', 'false');

    startButton.click(startTest);
    restartButton.click(function() {
        clearInterval(timerInterval);
        startButton.prop('disabled', false);
        startTest();
    });
    $('#restart-button').click(function() {
        resultPopup.addClass('hidden');
        clearInterval(timerInterval);
        startButton.prop('disabled', false);
        startTest();
    });
});