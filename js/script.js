
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Tone.js
    const synth = new Tone.Synth({
        oscillator: {
            type: 'sine'
        },
        envelope: {
            attack: 0.02,
            decay: 0.1,
            sustain: 0.3,
            release: 1
        }
    }).toDestination();

    // For more complex sounds
    const polySynth = new Tone.PolySynth(Tone.Synth).toDestination();
    
    // Define the notes for Indian classical music (Sa, Re, Ga, Ma, Pa, Dha, Ni, Sa)
    const notes = {
        'Sa': 'C4',
        'Re': 'D4',
        'Ga': 'E4',
        'Ma': 'F4',
        'Pa': 'G4',
        'Dha': 'A4',
        'Ni': 'B4',
        'Sa2': 'C5'
    };

    // Tab switching functionality
    const techniqueItems = document.querySelectorAll('.techniques-list li');
    const techniqueContents = document.querySelectorAll('.technique-content');

    techniqueItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            techniqueItems.forEach(i => i.classList.remove('active'));
            techniqueContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Show corresponding content
            const technique = this.getAttribute('data-technique');
            document.getElementById(technique).classList.add('active');
        });
    });

    // Play button functionality
    const playButtons = document.querySelectorAll('.play-button');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const technique = this.getAttribute('data-audio');
            playTechniqueAudio(technique);
        });
    });

    // Function to play audio examples for each technique
    function playTechniqueAudio(technique) {
        // Stop any playing sounds
        Tone.Transport.cancel();
        
        switch(technique) {
            case 'meend':
                // Glide from Sa to Pa
                const now = Tone.now();
                synth.triggerAttack(notes['Sa'], now);
                synth.frequency.rampTo(Tone.Frequency(notes['Pa']).toFrequency(), 1.5, now);
                synth.triggerRelease(now + 2);
                break;
                
            case 'kan':
                // Quick grace note (Re) before main note (Ga)
                const kanTime = Tone.now();
                synth.triggerAttackRelease(notes['Re'], '32n', kanTime);
                synth.triggerAttackRelease(notes['Ga'], '4n', kanTime + 0.1);
                break;
                
            case 'krintan':
                // Vibrato effect on Ma
                const krintanTime = Tone.now();
                synth.triggerAttack(notes['Ma'], krintanTime);
                
                // Create vibrato effect
                const vibrato = new Tone.Vibrato({
                    frequency: 8,
                    depth: 0.3
                }).toDestination();
                
                synth.connect(vibrato);
                setTimeout(() => {
                    synth.triggerRelease();
                    synth.disconnect(vibrato);
                    vibrato.dispose();
                }, 1500);
                break;
                
            case 'sparsh':
                // Light touch on Dha before Ni
                const sparshTime = Tone.now();
                synth.triggerAttackRelease(notes['Dha'], '32n', sparshTime, 0.3);
                synth.triggerAttackRelease(notes['Ni'], '4n', sparshTime + 0.15);
                break;
                
            case 'andolan':
                // Oscillation between Ga and Ma
                const andolanTime = Tone.now();
                
                // Schedule oscillating notes
                for (let i = 0; i < 6; i++) {
                    const note = i % 2 === 0 ? notes['Ga'] : notes['Ma'];
                    synth.triggerAttackRelease(note, '8n', andolanTime + (i * 0.2));
                }
                break;
                
            case 'gamak':
                // Complex ornamental phrase
                const gamakTime = Tone.now();
                const gamakSequence = [
                    { note: notes['Sa'], duration: '8n', time: 0 },
                    { note: notes['Re'], duration: '8n', time: 0.25 },
                    { note: notes['Ga'], duration: '8n', time: 0.5 },
                    { note: notes['Ma'], duration: '8n', time: 0.75 },
                    { note: notes['Ga'], duration: '8n', time: 1 },
                    { note: notes['Ma'], duration: '4n', time: 1.25 }
                ];
                
                gamakSequence.forEach(event => {
                    synth.triggerAttackRelease(
                        event.note,
                        event.duration,
                        gamakTime + event.time
                    );
                });
                break;
                
            case 'murki':
                // Quick turn around Pa
                const murkiTime = Tone.now();
                const murkiSequence = [
                    { note: notes['Pa'], duration: '16n', time: 0 },
                    { note: notes['Dha'], duration: '16n', time: 0.1 },
                    { note: notes['Pa'], duration: '16n', time: 0.2 },
                    { note: notes['Ma'], duration: '16n', time: 0.3 },
                    { note: notes['Pa'], duration: '4n', time: 0.4 }
                ];
                
                murkiSequence.forEach(event => {
                    synth.triggerAttackRelease(
                        event.note,
                        event.duration,
                        murkiTime + event.time
                    );
                });
                break;
                
            case 'zamzama':
                // Rapid alternation between Sa and Re
                const zamzamaTime = Tone.now();
                
                for (let i = 0; i < 6; i++) {
                    const note = i % 2 === 0 ? notes['Sa'] : notes['Re'];
                    synth.triggerAttackRelease(note, '16n', zamzamaTime + (i * 0.1));
                }
                break;
        }
    }

    // Interactive elements for each technique
    setupMeendInteraction();
    setupKanInteraction();
    setupKrintanInteraction();
    setupSparshInteraction();
    setupAndolanInteraction();
    setupGamakInteraction();
    setupMurkiInteraction();
    setupZamzamaInteraction();

    // Setup interactive functionality for each technique
    function setupMeendInteraction() {
        const finger = document.getElementById('meend-finger');
        const stringContainer = finger.parentElement;
        let isDragging = false;
        
        finger.addEventListener('mousedown', function(e) {
            isDragging = true;
            synth.triggerAttack(notes['Sa']);
            e.preventDefault();
        });
        
        stringContainer.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            const rect = stringContainer.getBoundingClientRect();
            const position = (e.clientX - rect.left) / rect.width;
            const clampedPosition = Math.max(0.1, Math.min(0.9, position));
            
            // Update finger position
            finger.style.left = (clampedPosition * 100) + '%';
            
            // Update sound frequency based on position
            const minFreq = Tone.Frequency(notes['Sa']).toFrequency();
            const maxFreq = Tone.Frequency(notes['Pa']).toFrequency();
            const currentFreq = minFreq + (maxFreq - minFreq) * position;
            
            synth.frequency.setValueAtTime(currentFreq, Tone.now());
        });
        
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                synth.triggerRelease();
            }
        });
    }
    
    function setupKanInteraction() {
        const graceNote = document.getElementById('kan-grace');
        const mainNote = document.getElementById('kan-main');
        
        graceNote.addEventListener('click', function() {
            synth.triggerAttackRelease(notes['Re'], '32n');
            
            // Highlight effect
            this.style.backgroundColor = '#6c3483';
            setTimeout(() => {
                this.style.backgroundColor = '#8e44ad';
            }, 300);
        });
        
        mainNote.addEventListener('click', function() {
            synth.triggerAttackRelease(notes['Ga'], '4n');
            
            // Highlight effect
            this.style.backgroundColor = '#6c3483';
            setTimeout(() => {
                this.style.backgroundColor = '#8e44ad';
            }, 300);
        });
    }
    
    function setupKrintanInteraction() {
        const finger = document.getElementById('krintan-finger');
        let isPressed = false;
        let vibratoEffect = null;
        
        finger.addEventListener('mousedown', function() {
            isPressed = true;
            
            // Create vibrato effect
            vibratoEffect = new Tone.Vibrato({
                frequency: 8,
                depth: 0.3
            }).toDestination();
            
            synth.connect(vibratoEffect);
            synth.triggerAttack(notes['Ma']);
            
            // Visual feedback
            this.style.backgroundColor = '#6c3483';
        });
        
        document.addEventListener('mouseup', function() {
            if (isPressed) {
                isPressed = false;
                synth.triggerRelease();
                
                // Clean up vibrato effect
                if (vibratoEffect) {
                    synth.disconnect(vibratoEffect);
                    vibratoEffect.dispose();
                    vibratoEffect = null;
                }
                
                // Reset visual
                finger.style.backgroundColor = '#8e44ad';
            }
        });
    }
    
    function setupSparshInteraction() {
        const touchNote = document.getElementById('sparsh-touch');
        const mainNote = document.getElementById('sparsh-main');
        
        touchNote.addEventListener('click', function() {
            synth.triggerAttackRelease(notes['Dha'], '32n', undefined, 0.3);
            
            // Highlight effect
            this.style.backgroundColor = '#6c3483';
            setTimeout(() => {
                this.style.backgroundColor = '#8e44ad';
            }, 200);
        });
        
        mainNote.addEventListener('click', function() {
            synth.triggerAttackRelease(notes['Ni'], '4n');
            
            // Highlight effect
            this.style.backgroundColor = '#6c3483';
            setTimeout(() => {
                this.style.backgroundColor = '#8e44ad';
            }, 300);
        });
    }
    
    function setupAndolanInteraction() {
        const finger = document.getElementById('andolan-finger');
        const stringContainer = finger.parentElement;
        let isDragging = false;
        let oscillationInterval = null;
        
        finger.addEventListener('mousedown', function(e) {
            isDragging = true;
            synth.triggerAttack(notes['Ga']);
            
            // Start oscillation
            let isGa = true;
            oscillationInterval = setInterval(() => {
                const note = isGa ? notes['Ga'] : notes['Ma'];
                synth.frequency.setValueAtTime(Tone.Frequency(note).toFrequency(), Tone.now());
                isGa = !isGa;
            }, 300);
            
            e.preventDefault();
        });
        
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                synth.triggerRelease();
                
                // Stop oscillation
                if (oscillationInterval) {
                    clearInterval(oscillationInterval);
                    oscillationInterval = null;
                }
            }
        });
    }
    
    function setupGamakInteraction() {
        const sequence = document.getElementById('gamak-sequence');
        
        sequence.addEventListener('click', function() {
            const gamakTime = Tone.now();
            const gamakSequence = [
                { note: notes['Sa'], duration: '8n', time: 0 },
                { note: notes['Re'], duration: '8n', time: 0.25 },
                { note: notes['Ga'], duration: '8n', time: 0.5 },
                { note: notes['Ma'], duration: '8n', time: 0.75 },
                { note: notes['Ga'], duration: '8n', time: 1 },
                { note: notes['Ma'], duration: '4n', time: 1.25 }
            ];
            
            gamakSequence.forEach(event => {
                synth.triggerAttackRelease(
                    event.note,
                    event.duration,
                    gamakTime + event.time
                );
            });
            
            // Visual feedback
            this.style.backgroundColor = 'rgba(142, 68, 173, 0.4)';
            setTimeout(() => {
                this.style.backgroundColor = 'rgba(142, 68, 173, 0.2)';
            }, 1500);
        });
    }
    
    function setupMurkiInteraction() {
        const turnMarker = document.getElementById('murki-turn');
        
        turnMarker.addEventListener('click', function() {
            const murkiTime = Tone.now();
            const murkiSequence = [
                { note: notes['Pa'], duration: '16n', time: 0 },
                { note: notes['Dha'], duration: '16n', time: 0.1 },
                { note: notes['Pa'], duration: '16n', time: 0.2 },
                { note: notes['Ma'], duration: '16n', time: 0.3 },
                { note: notes['Pa'], duration: '4n', time: 0.4 }
            ];
            
            murkiSequence.forEach(event => {
                synth.triggerAttackRelease(
                    event.note,
                    event.duration,
                    murkiTime + event.time
                );
            });
            
            // Visual feedback
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 500);
        });
    }
    
    function setupZamzamaInteraction() {
        const rapidMarker = document.getElementById('zamzama-rapid');
        let clickCount = 0;
        let lastClickTime = 0;
        
        rapidMarker.addEventListener('click', function() {
            const now = Date.now();
            const timeSinceLastClick = now - lastClickTime;
            
            // Play alternating notes
            const note = clickCount % 2 === 0 ? notes['Sa'] : notes['Re'];
            synth.triggerAttackRelease(note, '16n');
            
            // Visual feedback
            const position = (clickCount % 2 === 0) ? '30%' : '70%';
            const dot = document.createElement('div');
            dot.style.position = 'absolute';
            dot.style.width = '10px';
            dot.style.height = '10px';
            dot.style.backgroundColor = '#8e44ad';
            dot.style.borderRadius = '50%';
            dot.style.left = position;
            dot.style.top = 'calc(50% - 5px)';
            dot.style.opacity = '0.7';
            
            this.appendChild(dot);
            
            // Animate and remove dot
            setTimeout(() => {
                dot.style.opacity = '0';
                setTimeout(() => {
                    dot.remove();
                }, 300);
            }, 200);
            
            clickCount++;
            lastClickTime = now;
            
            // If clicks are rapid enough, play a special sequence
            if (timeSinceLastClick < 300 && clickCount > 4) {
                const zamzamaTime = Tone.now();
                
                for (let i = 0; i < 6; i++) {
                    const rapidNote = i % 2 === 0 ? notes['Sa'] : notes['Re'];
                    synth.triggerAttackRelease(rapidNote, '16n', zamzamaTime + (i * 0.1));
                }
                
                // Reset counter after special sequence
                clickCount = 0;
            }
        });
    }
});
