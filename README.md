## Reset table's primary key generation

### SELECT setval('"Posts_id_seq"', (SELECT MAX(id) FROM public."Posts")+1);

### SELECT setval('"Tags_id_seq"', (SELECT MAX(id) FROM public."Tags")+1);

### SELECT setval('"PostTags_id_seq"', (SELECT MAX(id) FROM public."PostTags")+1);

### SELECT setval('"MainCategories_id_seq"', (SELECT MAX(id) FROM public."MainCategories")+1);

### SELECT setval('"SubCategories_id_seq"', (SELECT MAX(id) FROM public."SubCategories")+1);

### SELECT setval('"Users_id_seq"', (SELECT MAX(id) FROM public."Users")+1);

#### imgs resource : https://mega.nz/#!2TRzWaIT!GV7gTekhN9ZS3ytohTGNLrSMVJ-OIh5HW2DNy57o-tI