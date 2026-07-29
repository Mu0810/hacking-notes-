/* ============================================================
   DATA · all content transcribed from the handwritten notes
   ============================================================ */

const DATA = {

  /* ---------- hero typing lines ---------- */
  typeLines: [
    'Also called -> Penetration Testing',
    '"Think like a hacker, act like a professional."',
    'Find the weakness before the attacker does.',
    'No permission? No engagement.'
  ],

  /* ---------- hero terminal script ---------- */
  terminal: [
    { t: 'ps1', v: 'analyst@kali:~$ ' , cmd: 'cat scope.txt' },
    { t: 'out', v: 'target   : acme-corp.com (10.10.0.0/24)' },
    { t: 'out', v: 'window   : 22:00 - 04:00 UTC' },
    { t: 'ok',  v: 'authorized by: CISO — signed RoE on file' },
    { t: 'gap' },
    { t: 'ps1', v: 'analyst@kali:~$ ', cmd: 'nmap -sS -sV -T4 10.10.0.14' },
    { t: 'out', v: 'PORT     STATE  SERVICE      VERSION' },
    { t: 'out', v: '22/tcp   open   ssh          OpenSSH 8.2p1' },
    { t: 'out', v: '80/tcp   open   http         nginx 1.18.0' },
    { t: 'hi',  v: '3306/tcp open   mysql        MySQL 5.7.29   <-- exposed' },
    { t: 'gap' },
    { t: 'ps1', v: 'analyst@kali:~$ ', cmd: 'echo "finding" >> report.md' },
    { t: 'warn', v: '[!] MySQL reachable from the DMZ — CVSS 8.1 (High)' },
    { t: 'ok',  v: '[+] documented, evidence captured, logs preserved' },
    { t: 'ps1', v: 'analyst@kali:~$ ', cmd: '' }
  ],

  /* ---------- key terms ---------- */
  terms: [
    {
      term: 'Hacker',
      short: 'finds ways to exploit systems',
      body: 'A broad label for anyone who probes a system deeply enough to make it do something it was not designed to do. Intent is what colours the hat.'
    },
    {
      term: 'Cracker',
      short: 'malicious hacker, personal gain',
      body: 'Breaks in without permission for money, data, disruption or ego. No scope, no rules of engagement, no report at the end.'
    },
    {
      term: 'Ethical hacker',
      short: 'works with permission',
      body: 'Same techniques, opposite mandate: written authorization, an agreed scope, and a report that leaves the defender stronger than before.'
    },
    {
      term: 'Vulnerability',
      short: 'weakness that can be exploited',
      body: 'A flaw in code, configuration, process or people — an unpatched service, a default password, a trusting employee on the phone.'
    },
    {
      term: 'Exploit',
      short: 'code or technique that abuses a vuln',
      body: 'The key cut for one specific lock. A vulnerability is the possibility; an exploit is the proof that it actually opens.'
    }
  ],

  /* ---------- 6 phases (P.T.E.S.T) ---------- */
  phases: [
    {
      n: 1, key: 'pre', name: 'Pre-Engagement', short: 'paperwork first',
      colour: '#ff4d6a',
      summary: 'Nothing technical happens until the boundaries are written down and signed. This phase is what makes everything after it legal.',
      tasks: [
        ['Define scope', 'Exactly which IPs, domains, apps and accounts are in play — and which are explicitly off-limits.'],
        ['Rules of engagement', 'Testing window, allowed techniques, escalation contacts, what to do the moment something breaks.'],
        ['Get authorization', 'Written and signed by someone with the authority to grant it. Verbal approval is not approval.'],
        ['Information gathering about target', 'Business context: what matters most to this client, what would hurt them most if lost.']
      ],
      deliverable: 'Signed RoE + scope document',
      pitfall: 'Scope creep. The interesting host just outside the range is still a crime.'
    },
    {
      n: 2, key: 'recon', name: 'Reconnaissance', short: 'learn everything',
      colour: '#3f9bff',
      summary: 'Build a picture of the target using public sources first, then careful direct contact. The better this phase, the shorter every phase after it.',
      tasks: [
        ['Passive recon', 'Collect data without ever touching the target: registrars, DNS records, leaked docs, employee profiles.'],
        ['Active recon', 'Direct interaction — pings, connections, banner reads. Now you appear in their logs.'],
        ['Footprinting', 'Assemble the pieces into a map of the organisation: netblocks, subdomains, technologies, people.'],
        ['OSINT', 'Open Source Intelligence — everything the internet has already published about them, for free.']
      ],
      deliverable: 'Target profile: assets, tech stack, people',
      pitfall: 'Rushing straight to scanning and missing the forgotten staging server.'
    },
    {
      n: 3, key: 'scan', name: 'Scanning', short: 'map the surface',
      colour: '#22e88a',
      summary: 'Convert a range of addresses into a precise inventory: which hosts answer, which ports listen, which versions are behind on patches.',
      tasks: [
        ['Network scanning', 'Discover live hosts and how the network is segmented.'],
        ['Port scanning', 'Find open TCP/UDP ports — this is Nmap territory.'],
        ['Service enumeration', 'Identify the exact software and version behind each open port.'],
        ['Vulnerability scanning', 'Match those versions and configs against known weaknesses.']
      ],
      deliverable: 'Host / port / service / vulnerability inventory',
      pitfall: 'Trusting the scanner. Every finding needs manual confirmation.'
    },
    {
      n: 4, key: 'access', name: 'Gaining Access', short: 'prove it',
      colour: '#a97bff',
      summary: 'Turn a theoretical vulnerability into a demonstrated one — carefully, with the minimum impact needed to prove the risk is real.',
      tasks: [
        ['Exploitation', 'Use a working exploit against a confirmed vulnerability to obtain a foothold.'],
        ['Password attacks', 'Brute force, dictionary or hash cracking against weak credentials.'],
        ['Web app attacks', 'SQLi, XSS, CSRF, file inclusion — the application layer is usually the softest.'],
        ['Privilege escalation', 'Move from limited user to admin/root, then map what that unlocks.']
      ],
      deliverable: 'Proof of exploitation + evidence trail',
      pitfall: 'Causing an outage. Impact must stay proportionate and agreed.'
    },
    {
      n: 5, key: 'maintain', name: 'Maintaining Access', short: 'hold the ground',
      colour: '#ffb638',
      summary: 'Demonstrate what a real intruder could do once inside: persist, blend in, and stay reachable. In a test this is simulated and always documented.',
      tasks: [
        ['Install backdoors', 'Show that persistence is achievable — and record exactly what was placed and where.'],
        ['Create users', 'Additional accounts as a persistence mechanism, again fully logged for cleanup.'],
        ['Keep access', 'Survive reboots and credential rotation to model a long-dwell attacker.'],
        ['Cover tracks', 'Test whether the defenders would actually notice — this measures their detection, not your stealth.']
      ],
      deliverable: 'Persistence inventory (every artefact you created)',
      pitfall: 'Losing track of an artefact. Anything you leave behind is now their problem.'
    },
    {
      n: 6, key: 'clear', name: 'Clearing Tracks', short: 'clean up + report',
      colour: '#e879f9',
      summary: 'Return the environment to exactly how you found it, then hand over the thing the client is actually paying for: the report.',
      tasks: [
        ['Delete logs', 'In a real intrusion, evidence removal. In a test, the tampering test itself — never destroy client evidence.'],
        ['Remove evidence', 'Delete every uploaded tool, script, shell and test file you introduced.'],
        ['Close backdoors', 'Remove all persistence: accounts, services, scheduled tasks, keys.'],
        ['Report findings', 'Findings, severity, reproduction steps, business impact and concrete remediation.']
      ],
      deliverable: 'The report — the only lasting output of the engagement',
      pitfall: 'A beautiful hack with a vague report is a failed engagement.'
    }
  ],

  /* ---------- scanning steps ---------- */
  scan: [
    ['Host discovery', 'Find live hosts', 'nmap -sn 10.10.0.0/24'],
    ['Port scanning', 'Find open ports', 'nmap -p- 10.10.0.14'],
    ['Service enumeration', 'Identify services', 'nmap -sV 10.10.0.14'],
    ['OS detection', 'Identify the OS', 'nmap -O 10.10.0.14'],
    ['Vulnerability scanning', 'Find known vulns', 'nmap --script vuln 10.10.0.14']
  ],

  /* ---------- tools ---------- */
  tools: [
    {
      name: 'Nmap', cat: 'network', role: 'Network scanning',
      desc: 'Host discovery, port scanning, service and OS fingerprinting. The first tool almost every engagement reaches for.',
      cmd: 'nmap -sS -sV -O 10.10.0.14'
    },
    {
      name: 'Wireshark', cat: 'network', role: 'Packet sniffing',
      desc: 'Captures and dissects traffic packet by packet — protocol errors, cleartext credentials, odd connections.',
      cmd: 'wireshark -i eth0 -k'
    },
    {
      name: 'Metasploit', cat: 'exploit', role: 'Exploitation framework',
      desc: 'A library of exploits, payloads and post-exploitation modules with consistent tooling around them.',
      cmd: 'msfconsole -q'
    },
    {
      name: 'Burp Suite', cat: 'web', role: 'Web app testing',
      desc: 'Intercepting proxy for HTTP(S) — inspect, modify and replay requests, then automate the interesting ones.',
      cmd: 'burpsuite &'
    },
    {
      name: 'SQLmap', cat: 'web', role: 'SQL injection testing',
      desc: 'Detects and exploits SQL injection automatically: enumerate databases, dump tables, sometimes reach the OS.',
      cmd: 'sqlmap -u "https://target/?id=1" --dbs'
    },
    {
      name: 'John the Ripper', cat: 'password', role: 'Password cracking',
      desc: 'Offline hash cracking with wordlists, rules and mangling — shows how fast weak hashes fall.',
      cmd: 'john --wordlist=rockyou.txt hashes.txt'
    },
    {
      name: 'Hydra', cat: 'password', role: 'Brute force attacks',
      desc: 'Online, parallel login brute forcing across many protocols: SSH, FTP, HTTP forms, RDP and more.',
      cmd: 'hydra -l admin -P rockyou.txt ssh://10.10.0.14'
    },
    {
      name: 'Aircrack-ng', cat: 'wireless', role: 'Wi-Fi security testing',
      desc: 'Suite for monitoring, capturing handshakes and testing the strength of WEP/WPA wireless keys.',
      cmd: 'aircrack-ng -w rockyou.txt capture.cap'
    },
    {
      name: 'Social Engineer Toolkit', cat: 'social', role: 'Social engineering',
      desc: 'SET builds phishing pages, malicious payloads and pretext campaigns for authorized human-layer testing.',
      cmd: 'setoolkit'
    }
  ],

  toolCats: [
    ['all', 'All tools'],
    ['network', 'Network'],
    ['web', 'Web app'],
    ['password', 'Passwords'],
    ['exploit', 'Exploitation'],
    ['wireless', 'Wireless'],
    ['social', 'Social eng.']
  ],

  /* ---------- attack families ---------- */
  attacks: [
    {
      name: 'Password Attacks', icon: 'key', colour: '#ff4d6a',
      sub: 'Guessing or recovering credentials instead of breaking the software.',
      vars: ['Brute Force', 'Dictionary', 'Rainbow Table'],
      def: 'Long unique passphrases, MFA everywhere, rate limiting and lockouts, slow salted hashes (bcrypt/argon2).'
    },
    {
      name: 'Network Attacks', icon: 'nodes', colour: '#3f9bff',
      sub: 'Abusing the path data travels rather than the endpoints themselves.',
      vars: ['Sniffing', 'MITM', 'ARP Spoofing'],
      def: 'Encrypt everything in transit (TLS/SSH), dynamic ARP inspection, port security, network segmentation.'
    },
    {
      name: 'Web Application Attacks', icon: 'globe', colour: '#22e88a',
      sub: 'The layer with the most code, the most change and the most exposure.',
      vars: ['SQLi', 'XSS', 'CSRF', 'LFI', 'RFI'],
      def: 'Parameterised queries, output encoding, CSP, anti-CSRF tokens, strict allow-lists for file paths.'
    },
    {
      name: 'Wireless Attacks', icon: 'wifi', colour: '#ffb638',
      sub: 'Radio does not stop at the wall, so the perimeter extends into the car park.',
      vars: ['WEP Cracking', 'WPA Cracking', 'Evil Twin'],
      def: 'WPA3 or WPA2-Enterprise, retire WEP entirely, 802.1X, rogue AP detection, strong PSKs.'
    },
    {
      name: 'Social Engineering', icon: 'mask', colour: '#a97bff',
      sub: 'Attacking the human layer — still the highest success rate of them all.',
      vars: ['Phishing', 'Pretexting', 'Baiting'],
      def: 'Ongoing awareness training, phishing-resistant MFA, out-of-band verification for money and credentials.'
    }
  ],

  /* ---------- principles ---------- */
  principles: [
    ['Legal Authorization', 'signed before anything starts'],
    ['No Harm', 'minimum necessary impact'],
    ['Confidentiality', 'client data never leaves scope'],
    ['Integrity', 'do not alter what you do not have to'],
    ['Reporting', 'full, honest, reproducible']
  ],

  /* ---------- CIA triad ---------- */
  triad: {
    c: {
      title: 'Confidentiality',
      body: 'Data should not be accessed by unauthorized persons.',
      ex: 'broken by -> sniffing, weak access control, data leaks'
    },
    i: {
      title: 'Integrity',
      body: 'Data should be accurate and unmodified.',
      ex: 'broken by -> MITM tampering, SQL injection, log editing'
    },
    a: {
      title: 'Availability',
      body: 'Data and services should be available when needed.',
      ex: 'broken by -> DoS, ransomware, deleted backups'
    }
  },

  /* ---------- quiz ---------- */
  quiz: [
    {
      q: 'What is ethical hacking also known as?',
      opts: ['Penetration testing', 'Reverse engineering', 'Threat modelling', 'Red teaming only'],
      a: 0,
      exp: 'The notes give it directly: ethical hacking is also called penetration testing.'
    },
    {
      q: 'Which phase comes first in P.T.E.S.T?',
      opts: ['Reconnaissance', 'Scanning', 'Pre-Engagement', 'Gaining Access'],
      a: 2,
      exp: 'Pre-Engagement: define scope, agree rules of engagement, get authorization. Nothing technical before that.'
    },
    {
      q: 'A weakness in a system that can be exploited is a…',
      opts: ['Exploit', 'Vulnerability', 'Payload', 'Backdoor'],
      a: 1,
      exp: 'A vulnerability is the weakness; an exploit is the code or technique that takes advantage of it.'
    },
    {
      q: 'Which of these is PASSIVE information gathering?',
      opts: ['Ping sweep', 'Banner grabbing', 'Google dorking', 'Port scanning'],
      a: 2,
      exp: 'Passive means no interaction with the target. Whois, dorking, social media and public DNS/IP data qualify.'
    },
    {
      q: 'Which tool is the go-to for network and port scanning?',
      opts: ['Wireshark', 'Nmap', 'Hydra', 'SQLmap'],
      a: 1,
      exp: 'Nmap: host discovery, port scanning, service enumeration and OS detection.'
    },
    {
      q: 'ARP spoofing belongs to which attack family?',
      opts: ['Web application attacks', 'Password attacks', 'Network attacks', 'Social engineering'],
      a: 2,
      exp: 'Network attacks: sniffing, MITM and ARP spoofing all abuse the network path.'
    },
    {
      q: '“Data should be accurate and unmodified” describes which CIA pillar?',
      opts: ['Confidentiality', 'Integrity', 'Availability', 'Authenticity'],
      a: 1,
      exp: 'Integrity. Confidentiality is about who can read it; availability is about it being there when needed.'
    },
    {
      q: 'Which phase produces the deliverable the client actually pays for?',
      opts: ['Scanning', 'Gaining Access', 'Maintaining Access', 'Clearing Tracks'],
      a: 3,
      exp: 'Clearing Tracks ends with reporting findings — clean up the environment, then hand over the report.'
    }
  ],

  /* ---------- boot sequence lines ---------- */
  boot: [
    'initialising secure workspace…',
    'loading module: reconnaissance',
    'loading module: scanning',
    'loading module: exploitation',
    'verifying authorization…            [ SIGNED ]',
    'scope locked                        [ OK ]',
    'ethics engine online                [ OK ]',
    'ready.'
  ],

  /* ---------- accent themes ---------- */
  themes: [
    { name: 'matrix',  acc: '#22e88a', acc2: '#00d3ff', glow: 'rgba(34,232,138,.45)' },
    { name: 'ice',     acc: '#00d3ff', acc2: '#a97bff', glow: 'rgba(0,211,255,.45)'  },
    { name: 'amber',   acc: '#ffb638', acc2: '#ff4d6a', glow: 'rgba(255,182,56,.45)' },
    { name: 'violet',  acc: '#a97bff', acc2: '#ff4d6a', glow: 'rgba(169,123,255,.45)'}
  ]
};
