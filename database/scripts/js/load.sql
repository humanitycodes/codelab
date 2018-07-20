-- Generated from msulansingcodesstaging-export.json

delete from project_completion;
delete from course_instructor;
delete from course_student_pending;
delete from course_student;
delete from course_lesson;
delete from course;
delete from lesson_prerequisite;
delete from lesson_project_criterion;
delete from lesson_learning_objective;
delete from lesson;
delete from app_user;

-- Converting 133 users

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'darinmor@msu.edu', 'Morgan Darin', false, 'morgandarin', 'delete_repo,notifications,repo,user', '8118875befd128442f5d13df2ed5c01899d349f8', 'bearer', 31672930, 'c385cd10-4ae9-11e4-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'ohryan@msu.edu', 'Ryan Seungmin Oh', false, 'ryanoh42', 'notifications,public_repo,user', 'c4a4fec8b7e691f6cdcc1d031dbaa5936d59154a', 'bearer', 21376933, '1f5081a6-6b9b-11e2-9d85-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'coffma30@msu.edu', 'Keaton Benjamin Coffman', false, 'KeatonCoffman', 'delete_repo,notifications,public_repo,user', '378916e0b4e80cb4ca72e6e479f2789e44905515', 'bearer', 24623107, '0f6ed088-c6e6-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'ackleyd1@msu.edu', 'David Edward Ackley', false, 'ackleyd1', 'notifications,public_repo,user', 'ed9e5137ddbe374a81454fd213d16d7fcaadacbe', 'bearer', 12974323, '9558c77a-4ed7-11e4-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'storingo@msu.edu', 'Dylan Ross Storing-Odowd', false, 'Storingo', 'notifications,public_repo,user', '721944f8379e23ec17d533ad5cfa99aa8d245149', 'bearer', 21958511, 'cc0684ce-4c2c-11e2-b185-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'heshiyan@msu.edu', 'Shiyang He', false, 'swe0d0', 'notifications,public_repo,user', '48f9ba2e732714bfeb1b18b0c8e8c6734d362fd8', 'bearer', 24991922, 'bbf0e5d6-4e5b-11e1-aed0-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'caflisch@msu.edu', 'Collin Reid Caflisch', false, 'collincaflisch', 'delete_repo,notifications,public_repo,user', '0f94c93807a5031e75e030aafb89cbdba6477e1a', 'bearer', 31675964, '0902833c-bc1a-11e4-90bf-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'willsbai@msu.edu', 'Bailee Wills', false, 'willsbai', 'delete_repo,notifications,repo,user', '419bac90258d06d77c3e8dcfa80715f3dd56cc78', 'bearer', 28719481, 'ca477e8c-4ae9-11e4-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'richa923@msu.edu', 'Sam Richardson', false, 'Richards292', 'delete_repo,notifications,repo,user', '64298c9ea3519d9ba5c692e6ed1e1a962499a4e8', 'bearer', 20329877, '176b7310-6bf3-11e4-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'englecal@msu.edu', 'Caleb Engle', false, 'englecal', 'delete_repo,notifications,repo,user', 'd64b2fb041ec57c3e8159fd7a9a8bcf0f6f84d19', 'bearer', 31546053, '58df0d80-6021-11e4-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'bremille@msu.edu', 'Michael Joseph Bremiller', false, '19mike95x', 'delete_repo,notifications,public_repo,user', 'af123c652288310896f45dfc99591b414c955002', 'bearer', 25164357, 'b68a7a70-d85b-11e4-90bf-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'jiangw14@msu.edu', 'Wei Jiang', false, 'by-the-w3i', 'notifications,public_repo,user', '6ef9c7174ab8bfb91ec535bd94ac72e8a9745e42', 'bearer', 21976464, '617517ca-8811-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'berryla3@msu.edu', 'Lauren Berry', false, 'berryla3', 'delete_repo,notifications,repo,user', '24f09c2bcf2812ae0a27b90f6e4bdc44e7fc4d2b', 'bearer', 33232321, '49ea401a-4934-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'lizheng9@msu.edu', 'Jackie Li', false, 'jackie099', 'delete_repo,notifications,repo,user', '650e7f528de21569a9c3d1b1303127456be2ca5f', 'bearer', 7269348, 'f3486b46-9e11-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'shinkhan@msu.edu', 'Hannah Rose Shink', false, 'hanshink', 'delete_repo,notifications,public_repo,user', '3483c375e8c4a0729ab51b3e86b8d68f086e64fe', 'bearer', 31487507, '91643638-f95c-11e4-9a0a-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'zhangl72@msu.edu', 'Linke Zhang', false, 'Linkegithub', 'notifications,public_repo,user', '2e0969beb9cd2fd54f505f7718056fa83378f61e', 'bearer', 25185836, '2bdbe444-0138-11e5-9a0a-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'kmiecchr@msu.edu', 'Chris Kmiec', false, 'Chris-Kmiec', 'delete_repo,notifications,repo,user', 'b8b204dd87079ac6f5a64edab4948ffb7f5e18c9', 'bearer', 27581725, 'fce7d050-35ce-11e0-a6ac-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'brook270@msu.edu', 'Brandon Christopher Brooks', false, 'ElusiveZephyr', 'delete_repo,notifications,public_repo,user', '2a31f5364bafbe85dca53bd432ea3b807be8bc8e', 'bearer', 22857692, '7a2d34f4-a06d-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'pearmans@msu.edu', 'Stuart W Pearman', true, 'stuartpearman', 'notifications,public_repo,user', '3969a609c611e3d128994fac272767b36facb7a1', 'bearer', 5412501, '6abd50f0-f4ba-11e0-a506-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'bauerj@msu.edu', 'Johannes Bauer', false, null, null, null, null, null, '119f7c6a-9c6d-102a-aa45-59a83c375d2f', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'ahmedibr@msu.edu', 'Abe Ahmed', false, 'atbe', 'delete_repo,notifications,repo,user', 'f02a737e404ce741570dcfb836b9720818d795a2', 'bearer', 987031, 'cbd43bfc-8a6c-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'erik.gillespie@gmail.com', 'Erik Gillespie', true, null, null, null, null, null, null, 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'mart1444@msu.edu', 'Griffin Thomas Martin', false, 'GriffinMartin', 'notifications,public_repo,user', '364d5d73e7e5246497624454bb5efd204236a0a7', 'bearer', 1090329, '65ab362c-f4ba-11e0-a506-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'marrio16@msu.edu', 'Brooke Jade Marriott', false, 'brookemarriott', 'delete_repo,notifications,public_repo,user', 'a4bfd0a6603b3140198e04106a997ab9cfb55a2f', 'bearer', 31833259, 'bb4e5eba-5f34-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'goshuama@msu.edu', 'Amanuel Lemessa Goshu', false, 'amanuel1995', 'delete_repo,notifications,public_repo,user', '9dfd8f2a34cb246d9087f90d943fb805d57328cb', 'bearer', 11286876, '6a1b7cfa-7f6c-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'millssa4@msu.edu', 'Samuel Mills', false, null, null, null, null, null, '35d22b05-d820-102a-8142-3543b3b77c46', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'xusiyi@msu.edu', 'Siyi Xu', false, null, null, null, null, null, 'dfd0b610-e292-11e4-90bf-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'harr1193@msu.edu', 'Kyle Jordan Harris', false, 'harr1193', 'notifications,public_repo,user', 'e1be57148807759808ce14ac6313db0b8c7b2d49', 'bearer', 18063956, '69fb850a-2c18-11e3-a665-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'leecurti@msu.edu', 'Curtis Lee', false, 'leecurti', 'delete_repo,notifications,repo,user', 'b36a5eb8d6998dd6c605c9efc654ec5a372895cf', 'bearer', 31481681, '6dbfe130-e134-11e5-8a8b-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'yezbackj@msu.edu', 'Jackson Yezback', false, 'yezdev', 'delete_repo,notifications,repo,user', 'b60c5d2ac7201ba2b75281bca3a284ee60a34262', 'bearer', 32349441, '04315064-ec9e-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'atomaka@msu.edu', 'Andrew Tomaka', false, null, null, null, null, null, '133d194d-9c6d-102a-aa45-59a83c375d2f', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'bascojoa@msu.edu', 'Joanna Faye Basco', false, 'JoannaBasco', 'delete_repo,notifications,public_repo,user', '8ced8cab7ebf4457684957bcb205db9981f52fee', 'bearer', 31491631, 'aadc3716-86aa-11e4-ad3c-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'graha179@msu.edu', 'Christopher Graham', false, 'chrisgrizzy', 'notifications,public_repo,user', '54077b34d6fe9449ef94c9bcc6fc9463a0ed12d6', 'bearer', 19395573, '6625b0d6-33d0-11e2-b185-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'butle172@msu.edu', 'Thomas John Butler', false, 'TButler734', 'delete_repo,notifications,public_repo,user', '9e683dc41ae37bec1787de58cad592a9706a9175', 'bearer', 31478472, 'fd6e1ffc-5aa0-11e4-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'fritzchr@msu.edu', 'Chris Fritz', true, 'chrisvfritz', 'notifications,public_repo,user', '0545e329003b181fe4af2b9d87e8724833e0a8e9', 'bearer', 2327556, '138b55f0-9c6d-102a-aa45-59a83c375d2f', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'skarritt@msu.edu', 'Kelly Michelle Skarritt', false, 'kellyskarritt', 'notifications,public_repo,user', 'd8e4c24c59c0264374e657f14a9439daeb460b4d', 'bearer', 19376971, '333bf2e8-4eb4-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'osmarall@msu.edu', 'Allison Siarto', false, null, null, null, null, null, '1357065a-9c6d-102a-aa45-59a83c375d2f', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'lizehua3@msu.edu', 'Zehua Li', false, 'OneRandomMikey', 'notifications,public_repo,user', 'e9e1abc456ae7ddbdacdf842f2a58050d7cb43cc', 'bearer', 21979449, 'a94632b2-89a3-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'joseph62@msu.edu', 'Sean Joseph', false, 'joseph62', 'delete_repo,notifications,repo,user', '30896a1116fbd972f2b5aede0c90541d71ed1acf', 'bearer', 23508125, '0a5b5a14-4219-11e3-a665-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'guertint@msu.edu', 'Tim Guertin', false, 'guertint73', 'delete_repo,notifications,repo,user', '8e1e8d65c4433c33e3564d348a649a6b2ad2f2d9', 'bearer', 16988483, '0b16cb30-5c10-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'wadasnat@msu.edu', 'Nathaniel Ellington Wadas', false, 'Wadzillaa', 'delete_repo,notifications,public_repo,user', '918dc69135a6118fad0abf19e2c7271b2f6d1507', 'bearer', 32042088, 'c22f8a10-d46d-11e4-90bf-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'tesfami1@msu.edu', 'Amanuel Tesfazgi Tesfamichael', false, 'amanmichael19', 'delete_repo,notifications,repo,user', 'ab3ccc8c3536815f7b5b81e9df587734ce7c6479', 'bearer', 25000491, '08c4b960-a290-11e4-a43f-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'kulkar58@msu.edu', 'Prateek Gururaj Kulkarni', false, 'WebDesigner122194', 'delete_repo,notifications,public_repo,user', '36485c611e4dd0ab1599994df1f9a96f97c6cc69', 'bearer', 31485383, '69dd8f72-7b52-11e2-9d85-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'nguye295@msu.edu', 'Mary Nguyen', false, 'nguye295', 'delete_repo,notifications,repo,user', '766096e3d9b8a42f8c428863ce51968d66af9309', 'bearer', 31523374, 'a50d2ea6-465a-11e0-a6ac-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'pettwayb@msu.edu', 'Barry Dennard Pettway', false, 'bdpettway19', 'notifications,public_repo,user', '317b8d9b6f4f57908ca117ec6f9141ae9ffeb2a0', 'bearer', 14190034, 'f2361c26-b389-102c-9af3-7d379e7365a2', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'mcelwee3@msu.edu', 'Joel Mcelwee', false, 'JoelMcElwee', 'delete_repo,notifications,repo,user', '678809234ca2f3846363cfa9d59975021615867b', 'bearer', 30763367, 'cdbe3b08-6163-11e2-b185-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'alexa472@msu.edu', 'Justice Troy Alexander', false, 'JAHub97', 'delete_repo,notifications,public_repo,user', 'd1b18be3635490ab33014a1133e6e0b6b6e3cf15', 'bearer', 31738123, '940848aa-ceed-11e4-90bf-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'chrisg@msu.edu', 'Chris Gustafson', false, 'cgustaf11', 'delete_repo,notifications,repo,user', 'bdef10556f9bfa33fe818d117a18eadcaa43750d', 'bearer', 1294814, 'f016cb98-27e4-11e6-8a8b-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'hsiyufen@msu.edu', 'Yufen Hsi', false, 'yufenhsi', 'delete_repo,notifications,repo,user', '60509d0a4132b4877744e30620239c2cd5fd873d', 'bearer', 35323627, '2642de18-28ae-11e6-8a8b-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'walke559@msu.edu', 'Tamesha Carolyn Walker', false, 'twalker12', 'notifications,public_repo,user', '832fcc0661d012f1de07e09e859df64274a6c05c', 'bearer', 19522620, 'c44223f0-3b7b-11e1-89ac-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'pencemit@msu.edu', 'Mitchell Pence', false, 'mitchellpence', 'delete_repo,notifications,repo,user', 'd5c12b1bb941f53fa871f8db588c2ede5bb88444', 'bearer', 4493151, 'f7eee56a-24d9-11e2-b185-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'azerbran@msu.edu', 'Brandon Azer', false, 'a0z1e0r8', 'delete_repo,notifications,repo,user', '922f3ede629ac7aaf4c93923685fde98c1a00de2', 'bearer', 11723613, '1bdac1bc-6bf3-11e4-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'schro266@msu.edu', 'Tyler James Schroeder', false, 'tylerschroeder7', 'notifications,public_repo,user', '4f66c412c79641b7869e6ef22693730c4fc2c3d8', 'bearer', 22039935, 'a01684f0-be75-11e4-90bf-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'maliklau@msu.edu', 'Lauren Cecilia Malik', false, 'maliklau', 'notifications,public_repo,user', '77bd6e07190604240ecedad047cc54ce9bf48234', 'bearer', 17524958, 'ba619940-5457-11e4-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'ottarso6@msu.edu', 'Amber Landry Ottarson', false, 'amberottar6', 'delete_repo,notifications,public_repo,user', 'b78c48929c4de77137bd85d9999a27aa6a06f2e7', 'bearer', 31481861, '8a4e939e-46d8-11e3-a665-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'rossjaso@msu.edu', 'Jason Ross', false, 'rossjaso', 'delete_repo,notifications,repo,user', 'f79fcafa14f5c0a8d125f05e7e183fa204a942a5', 'bearer', 35353545, '2b4723c4-6fb5-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'briscoe2@msu.edu', 'Christian Erick Briscoe', false, 'cbriscoe95', 'notifications,public_repo,user', 'fd281e75bb258768a7e3cbbb927ee3103a5681a6', 'bearer', 22037190, '21336b04-622d-11e2-b185-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'glomstea@msu.edu', 'Grant Daniel Glomstead', false, 'glomstea', 'notifications,public_repo,user', 'b12c043559c699eae09f00d331920e5fbce96201', 'bearer', 21671864, '67c96844-9666-11e2-ba7e-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'eshlema5@msu.edu', 'Aaron Joseph Eshleman', false, 'aaronaaroff', 'delete_repo,notifications,public_repo,user', '070ab0193d8288fda6c2f4ce4721bb094ad7108f', 'bearer', 31701066, '00f598d8-5f58-11e4-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'finchmar@msu.edu', 'Marcus Finch', false, 'finchmar', 'delete_repo,notifications,public_repo,user', 'e18c17a87637e673046275905f6efe56a05722e8', 'bearer', 19435863, '9adfa408-0755-11e4-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'noffsi13@msu.edu', 'Sarah Jane Noffsinger', false, 'noffsi13', 'delete_repo,notifications,public_repo,user', 'c4f80d9e3218b68200bd63c67e27144ec2d50a8f', 'bearer', 31490286, '279f4d22-4eb4-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'gilrea10@msu.edu', 'Nick Gilreath', false, 'NGilreath0143', 'delete_repo,notifications,repo,user', '3d604db13274a1d65b999943b7321a6bee37ccd1', 'bearer', 18146023, '45013a2c-4934-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'wardinga@msu.edu', 'Gabe Wardin', false, 'GabeWardin', 'delete_repo,notifications,repo,user', 'edc37bbb3561e4347336d222c2388906562179f9', 'bearer', 31523548, '8d8e135e-68a2-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'jebaramu@msu.edu', 'Mustafa A Jebara', false, 'MustafaJebara', 'delete_repo,notifications,public_repo,user', 'f1c172b78b479c3125e7ad12f97b03d61930fe99', 'bearer', 31708121, '7ad70420-a06d-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'tangjos1@msu.edu', 'Joseph Enoch Tang', false, 'derpachu', 'delete_repo,notifications,public_repo,user', '32e01f4629da0bd4f032cb7553872412dfcf5e41', 'bearer', 11252190, '52d12132-43ab-11e3-a665-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'ranshun@msu.edu', 'Shun Ran', false, 'ranshun', 'delete_repo,notifications,repo,user', 'd0da8547ac3cd13733b3b6133ff9f0ef137a67c4', 'bearer', 24983821, '7ad0e61c-7ea3-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'winnerc2@msu.edu', 'Caleb Winner', false, 'winnerc2', 'delete_repo,notifications,repo,user', '0fc57a26c6e6fbd97a065ad422078327cd3ad154', 'bearer', 31714504, 'cbb9e418-d46d-11e4-90bf-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'mitch702@msu.edu', 'Andrew Craig Mitchell', false, 'amitch6097', 'delete_repo,notifications,public_repo,user', '2dd7c105b9cf925e037681c6c11c003b207576bd', 'bearer', 19411222, '537689b0-2999-11e2-b185-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'mrouemic@msu.edu', 'Michael Mroue', false, 'michaelmroue', 'delete_repo,notifications,repo,user', '5cc7a6cdbf941f8b1fa8c6f888edfb03219a5aff', 'bearer', 23087444, 'a3d40832-6da8-11e5-8a8b-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'doerrmi1@msu.edu', 'Micah Doerr', false, 'MicahDoerr', 'delete_repo,notifications,repo,user', '9c8ace9a2503b899318026193c2becdc0eff0c9f', 'bearer', 31709974, '718b5538-9a7b-11e5-8a8b-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'naokenne@msu.edu', 'Kenny Nao', false, 'HanzoFiyuri', 'delete_repo,notifications,repo,user', '50c205bdcc3eb959bea882405f4f68235bdf4ed9', 'bearer', 21979186, 'ff431d9a-24d9-11e2-b185-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'proosjen@msu.edu', 'Jenn Proos', false, 'proosjen', 'delete_repo,notifications,repo,user', '93326d85d8b2618d298f6552ea77e9d44fae58dd', 'bearer', 15652928, '3f1c6758-3e2b-11e3-a665-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'wangyi70@msu.edu', 'Yi Chuan Wang', false, 'yichuandoris', 'notifications,public_repo,user', '8318d8277b32441c1b997a1344d0301dc263f136', 'bearer', 25042317, '788bd186-d2db-11e4-90bf-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'liubing1@msu.edu', 'Bingyi Liu', false, 'zhezixi', 'delete_repo,notifications,repo,user', 'dadbbc2f83ce62caced5ba9540c1a2630f8b762e', 'bearer', 31932950, '183c880c-a45b-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'sundar22@msu.edu', 'Meenu Sundararaju', false, 'meenusundar', 'delete_repo,notifications,repo,user', 'e1caebfa42e6594a3e843c5e10caca122e3be31a', 'bearer', 13774286, 'f8f6d6e6-3718-11e3-a665-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'kfritz@msu.edu', 'Katie Fritz', true, 'KatieMFritz', 'delete_repo,notifications,repo,user', 'ea870feeb0f90d49c3b40277b9addf02fd907716', 'bearer', 7085184, 'ae94c12a-dc33-11e7-ab3f-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'macdo226@msu.edu', 'Nick Macdonald', false, 'macdo226', 'delete_repo,notifications,repo,user', 'da313e123548ec0093f16c67fb57379e804660fd', 'bearer', 31669060, '9517a250-6cbd-11e4-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'kodurnay@msu.edu', 'Nayana Kodur', false, 'kodurnay', 'delete_repo,notifications,public_repo,user', 'e9d6859df33fe6a330510f190204b508f8cd9308', 'bearer', 11194027, '4b3de912-98fa-11e1-b12c-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'clarkr28@msu.edu', 'Jared Clark', false, 'clarkr28', 'delete_repo,notifications,repo,user', '733ff812441169eee3466f595d425246f51783a5', 'bearer', 21699613, '05a92f80-3c99-11e3-a665-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'vonderh3@msu.edu', 'Connor Vonderhoff', false, 'cvonderhoff', 'delete_repo,notifications,repo,user', '8b0cf131bb90740fb7b4b4ad8bbb9c138c59b17f', 'bearer', 28879044, '739a961a-d792-11e4-90bf-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'lilytlrau@gmail.com', 'Lily Rau', false, 'RauLily', 'delete_repo,notifications,repo,user', '7c2e88b364d07163d0441e8818263859d11a32f1', 'bearer', 35242704, null, 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'instructor1@lansingcodelab.com', 'Instructor One', true, 'codelabinstructor1', 'notifications,public_repo,user', 'b96c3a892a7fe80f90c83f31d31ce5d1ed35b8e5', 'bearer', 24843855, null, 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'student1@lansingcodelab.com', 'Student One', false, 'egillespie', 'delete_repo,notifications,public_repo,user', '4b60b5ea23613b39e32ffccb520490bab3038c29', 'bearer', 5572255, null, 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'channeye@msu.edu', 'Eric Channey', false, 'Ezchan', 'delete_repo,notifications,repo,user', '0c8d58fd23732d673cbaae35420eced947478196', 'bearer', 13616105, '16d52616-622d-11e2-b185-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'ryanevan@msu.edu', 'Evan Lee Ryan', false, 'barcabarca216', 'notifications,public_repo,user', '94834cdc6a1ba1a7be868055f4c9392879b764c7', 'bearer', 21992787, '0807e386-fb8c-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'danie265@msu.edu', 'Jasmine Daniel', false, 'danie265', 'delete_repo,notifications,repo,user', 'a2a3c1124d81da80833ebbbfba4505b3ee61a576', 'bearer', 31824500, '59b2c818-832e-11e2-ba7e-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'mundygab@msu.edu', 'Gabrielle Alexis Mundy', false, 'G-Mundy', 'delete_repo,notifications,public_repo,user', 'da5cdbe7919d5fd9526e352f8e8fbad0da8e754a', 'bearer', 31675656, '3ee184c0-6f50-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'levins23@msu.edu', 'Madeline Mae Levinson', false, 'levinsonmm', 'notifications,public_repo,user', '70c606ff5ee89485abc2ac0a913db2bcd57eae5b', 'bearer', 11743172, 'daa24986-cf8a-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'squibbsg@msu.edu', 'Grace Kathleen Squibbs', false, 'gsquibbs', 'notifications,public_repo,user', '60be7f59edfe03d65beae689fdc1ed8da27c131d', 'bearer', 22016119, 'a3614202-3499-11e2-b185-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'thom1508@msu.edu', 'Marcus Thomas', false, 'mthomas1122', 'delete_repo,notifications,repo,user', '514381c91fec6f2871e3050d8c8081176a7add04', 'bearer', 26515349, 'b05addda-2264-11e6-8a8b-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'john4181@msu.edu', 'William Cooper Johnston', false, 'Gr8orangeone', 'delete_repo,notifications,public_repo,user', 'eaace0048612885ec058d6fb62d9eaa5922f0409', 'bearer', 26614906, '00caea3e-adf5-11e4-90bf-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'rixausti@msu.edu', 'Austin Scott Rix', false, 'austin1244', 'notifications,public_repo,user', 'e4e50721ba84fd5932e195068e47a5b3d823343c', 'bearer', 25042153, '48e2467a-cd5b-11e4-90bf-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'woodyden@msu.edu', 'Dennis Alexander Woody', false, 'woodyden', 'delete_repo,notifications,public_repo,user', 'fe563c06c940efb8095d3ce6a0a6dc56032c54e0', 'bearer', 31664579, 'a989da7e-6c90-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'chenfan9@msu.edu', 'Fan Chen', false, 'chenfan9', 'notifications,public_repo,user', '5a265094b0453e1c291a5ac73a3552b1c8ba0463', 'bearer', 22015820, '7304f3a4-9666-11e2-ba7e-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'frinklil@msu.edu', 'Lily Ann Frink', false, 'frinklil', 'delete_repo,notifications,public_repo,user', '742291b728f3dc4349d6d9b7b935762ed15bfc53', 'bearer', 31810514, '40bf30a0-a881-11e0-8662-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'katie@katiemfritz.com', 'Katie Fritz', true, null, null, null, null, null, null, 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'suther98@msu.edu', 'Kevin Sutherland', false, 'suuuth', 'delete_repo,notifications,repo,user', '25fd20f5353bd89696f580852bd424cdb7c12430', 'bearer', 31667253, '7f893eb2-2c18-11e3-a665-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'filiamel@msu.edu', 'Amela Fili', false, 'amelafili', 'delete_repo,notifications,repo,user', '52449980e8295f564ba3ebbc43503e81e1e33d16', 'bearer', 31477792, 'ac77ef3a-6da8-11e5-8a8b-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'honeyrya@msu.edu', 'Ryan Honey', false, 'Galactimo', 'delete_repo,notifications,repo,user', 'ec0538caa4d51a09aaea189bc759f440ca3d6fa2', 'bearer', 31493773, '69775922-7f6c-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'kenne437@msu.edu', 'Anna Marie Kennedy', false, 'kenne437', 'delete_repo,notifications,public_repo,user', 'aab9e471336acdb44f6ac23fbee341febe934c1f', 'bearer', 31483579, '8fa645b0-6cbd-11e4-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'will2844@msu.edu', 'Sydney Marie Williams', false, 'will2844', 'delete_repo,notifications,public_repo,user', '045d2071977d8ca3fe006ba8a2dede80af830716', 'bearer', 31903835, '11caca9e-c6e6-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'wolyniec@msu.edu', 'Ivan Edward Wolyniec', false, 'wolyniec', 'notifications,public_repo,user', 'c096594b2b53f294a47dae5d34f9a492b0c4f815', 'bearer', 20229930, 'e912ed84-5892-11e1-aed0-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'jasperha@msu.edu', 'Hatch Vivian Jasper', false, null, null, null, null, null, 'e31aa846-f56e-11e4-9a0a-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'lamjess1@msu.edu', 'Jessica Zi-Ying Lam', false, 'jessicalam', 'notifications,public_repo,user', '5eb2a236a140302ebad2169ddba0073f098c7411', 'bearer', 21376740, '8a26504c-7c73-11e4-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'woodsbr6@msu.edu', 'Brielle N Woods', false, 'woodsbr6', 'notifications,public_repo,user', 'dda3cda2c584a8f270fd87716cd47bd3f2784a6f', 'bearer', 19375228, 'b1b3d1c8-9081-11e2-ba7e-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'dennis57@msu.edu', 'Matthew Scott Dennis', false, 'mdennis1318', 'notifications,public_repo,user', '13f10139ce45154599f864a199fa33012bcab931', 'bearer', 22460398, 'ffc85aae-5f57-11e4-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'gille143@msu.edu', 'Erik Gillespie', true, 'egillespie', 'delete_repo,notifications,repo,user', '5d5e4b2117f6189bb2622e1322041abdddb57129', 'bearer', 5572255, '80baf4f7-117f-4dcc-bf25-91a9dc57c09a', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'deckercu@msu.edu', 'Curtis Glenn Decker', false, 'CuDecker', 'notifications,public_repo,user', 'ba156c8fc11649e1e4dffc7168697175d9e185be', 'bearer', 22035458, '2f5cd404-09fa-11e1-a506-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'noonanro@msu.edu', 'Robert Charles Noonan', false, 'BobbyNoonanMSU', 'delete_repo,notifications,public_repo,user', '0f8a2455a626cebed32f1cec58b3753f7afaa7fa', 'bearer', 34461968, 'c53dae3e-4ae9-11e4-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'skarlich@msu.edu', 'Christian Olaf Skarli', false, 'skarlich', 'delete_repo,notifications,public_repo,user', '81d9c414f1499dab9aec11925a9177c1d87df73d', 'bearer', 31837086, '658e6eae-501a-11e2-b185-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'huynhjen@msu.edu', 'Jenny Huynh', false, 'jennyhuynh', 'delete_repo,notifications,public_repo,user', '38cc128238bb10e8723aa8084001ac8285a5af3e', 'bearer', 19566723, '8f23e3ac-7c73-11e4-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'mekamano@msu.edu', 'Manotej Meka', false, 'manotejmeka', 'notifications,public_repo,user', 'f077aab08d0544b78e78e264d42f41e2dea1b50a', 'bearer', 5170285, '7b6c2c00-2fe2-11e2-b185-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'mateene@msu.edu', 'Mateen Esfahanian', false, 'friendo9876', 'notifications,public_repo,user', '59624085b99c7cce0e8114f0e8adef2e2000049f', 'bearer', 5571452, 'da4601f4-7a54-11e1-b12c-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'joseph98@msu.edu', 'Antwan Joseph', false, null, null, null, null, null, '0f92f9aa-c824-48db-a114-fbb4f05f54a3', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'sheikhre@msu.edu', 'Rehman Qasim Sheikh', false, 'sheikhre', 'delete_repo,notifications,public_repo,user', 'b8a5cff7273a2cc37afccc90dfc4a5b61e684d4e', 'bearer', 31699898, '27fdcc74-536b-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'kimjust2@msu.edu', 'Justin Kim', false, 'kimjust2', 'delete_repo,notifications,repo,user', 'a39b365308f2561a112efad0a9bc9e77ad313b75', 'bearer', 22037508, 'd69e1028-4c2c-11e2-b185-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'portern7@msu.edu', 'Nick Porter', false, 'NickPorter3', 'delete_repo,notifications,repo,user', '8433355a374fb415be3b85d3f4baf6cb21f338da', 'bearer', 31492982, 'fe7b5ed6-36a6-11e5-8a8b-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'frisanco@msu.edu', 'Benjamin John Frisanco', false, 'frisanco', 'delete_repo,notifications,public_repo,user', 'fe753c453dc063ef2da87abbb1780e86b6936591', 'bearer', 31487568, '523acb7c-6021-11e4-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'nijingha@msu.edu', 'Jinghan Ni', false, 'nijinghan', 'delete_repo,notifications,repo,user', '85df46e3502ded688dc9f8438955d7405767d5ce', 'bearer', 31674333, '2e84ccaa-7f98-11e4-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'zhengyu7@msu.edu', 'Yuhao Zheng', false, 'Michaex', 'delete_repo,notifications,public_repo,user', '8270ea95405bacff2c8faca0adfaeb75d9b27427', 'bearer', 31746757, 'f58d31c0-9e11-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'lishiyu4@msu.edu', 'Shiyu Li', false, 'lishiyu4', 'delete_repo,notifications,public_repo,user', 'c614b72a789f9fac8bad04290604737f3c548081', 'bearer', 32647933, '4bfb37a8-9fa4-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'peughter@msu.edu', 'Terrence Gene Peugh', false, 'ninjagangsta', 'delete_repo,notifications,public_repo,user', 'bc906a9ccc0594378cbae0dde6633ba024c88ff6', 'bearer', 31672855, '0ed72b22-5759-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'siartoje@msu.edu', 'Jeff Siarto', true, 'jsiarto', 'delete_repo,notifications,public_repo,user', '68afa7ed50ddc03c11c28e05d7a517ebbc14fba1', 'bearer', 3758, '132d78ed-9c6d-102a-aa45-59a83c375d2f', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'nicoskia@msu.edu', 'Alexander Dennis Nicoski', false, 'nicoskia', 'notifications,public_repo,user', '867e308ea3c8130460a710ca6ed4daf3a721198b', 'bearer', 3492409, '62f512b2-2999-11e2-b185-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'xuteng@msu.edu', 'Teng Xu', false, 'Tengger', 'delete_repo,notifications,repo,user', 'ef7c89ba018c9f1d035449fba0596592e27def7a', 'bearer', 8854651, '7206d9ae-9666-11e2-ba7e-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'normanwi@msu.edu', 'William Allen Norman', false, 'lordcrekit', 'notifications,public_repo,user', '2e31dbb3bebc2f9f9b0f6670d0dd11fae5aba6ef', 'bearer', 5678547, '8e951bee-394c-102e-8476-96e2aaab5dcc', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'fuzhiqi@msu.edu', 'Zoe Fu', false, 'fzzzoe', 'delete_repo,notifications,repo,user', 'de85261bc9e7be9d4e124bea9332795c8ddc7688', 'bearer', 31496167, 'ca8dd8d8-5f34-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'kisyular@msu.edu', 'Rellika Nziliu Kisyula', false, 'kisyular', 'notifications,public_repo,user', 'd03597607756b11d97fcf18afecd20d0a29e3831', 'bearer', 15636554, 'd0016714-93da-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'mart1527@msu.edu', 'Jacob Alan Martinez', false, 'jmartinez95', 'notifications,public_repo,user', '8130effbe36d6e6b49fe97c4a46f58b278babb0b', 'bearer', 10256426, '979b8436-1910-11e2-a764-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'qassisju@msu.edu', 'Justin Ihab Qassis', false, 'qassisju', 'notifications,public_repo,user', '3c8ebdd27ed18abb245bba49c1a04892abca72a6', 'bearer', 15862682, 'a65f66e8-e19d-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'zhaohans@msu.edu', 'Hansheng Zhao', false, 'copyrighthero', 'notifications,public_repo,user', 'd350285c1ad6cc88e682e4d9cd65ef9be84c56e8', 'bearer', 1370128, '51ddba3a-9aed-11e3-abd1-0050568f7ab1', 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'student2@lansingcodelab.com', 'Student Two', false, null, 'user', '7643309357c9216192fb2a72d1ac1a869091cde7', 'bearer', 7085184, null, 0 );

insert into app_user ( email, full_name, role_instructor, github_login, github_scope, github_token, github_token_type, github_user_id, msu_uid, version )
values ( 'tilak.mishra@gmail.com', 'Tilak Mishra', false, 'tilakmishra', 'delete_repo,notifications,repo,user', '0c1c001649f57d7884d4a93436ba3b98237aa9ce', 'bearer', 7193347, null, 0 );

