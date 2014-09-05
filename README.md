StepUp
======

https://www.youtube.com/watch?v=Vfkx0-lkIxU
Youtube demo link : https://www.youtube.com/watch?v=Vfkx0-lkIxU



“Step Up”-Analysis of Western Dances
Neha Mundada1 , Purva Tadphale1
1 University of Southern California, Computer Science Department,
Los Angeles, CA, 90089
{mundada,tadphale}@usc.edu
Abstract. ‘To touch, to move, to inspire. This is the true gift of dance’. Dance is a type of art that generally involves movement of the body, often rhythmic and to music. Dances have many significant attributes like movements and beats which are central to a dance style. A Wikipedia page lays out information about a dance form and mentions what genre it has or under what category it falls, but the structured information about individual dance forms based on the moves is missing. We propose to integrate information about dance styles, which are most popular today, from a variety of sources and produce a mashup to layout similarities and distinctions be-tween dance forms supported by interactive graphical visuals. In today’s popular dance forms, most significant factor that marks impression is the ‘dance moves’. Few dance forms might have overlap between their dancing styles depending upon these moves, which leads to various interesting conclusions. Our application analyzes and extracts the knowledge and facts that are not evident otherwise.
Keywords: mashup, data integration, linked data, semantic web, dbpedia, google refine, ontology, centrality, betweenness, SPARQL
1 Motivation
A lot of details regarding any dance form are readily available today on the in-ternet, but this information is unstructured and needs to be curated. For example if you see dance A and feel that it is very similar to another dance B but you exactly cannot know, what are the overlapping factors that these two dance forms share. This information is very useful for the dancers as well as dance institutes. Hence, there is a need to integrate the data from various sources on the web, which gives her the ability to explore and find interesting facts about the dance forms. Motivated by this, our web based application provides the platform for users to find the details and interest-ing inferences about the most popular western dances.
2. Approach
To create our mashup application, we used the data sources Dancesteps.com
[1], buzzle.com [3] and dbpedia [5].We used Flickr [4] and YouTube [8] to integrate
videos and pictures of all dances and individual movements. First step in our project
was to decide the attributes and limit the scope of our project to a few dance styles.
As we gathered the information about various forms of dances, we learnt that there is
a very interesting relationships between the dances and its moves. Hence, we decided
to make our application ‘moves’ centric. We also finalized the other parameters like
beat, artists, origin, dance category and parent move category. We searched for the
ontology, which could correctly depict the relationships between these attributes.
Though we could find the many ontologies in music domain, there was no suitable
ontology, in dance domain. Hence, we wrote our own ontology to depict the dance
vocabulary.
2.1 Data Extraction, Cleaning and Reconciliation
After finalizing the model, we extracted the data. The data sources did not
provide any APIs to extract the required information, so we scraped those using
scraping tools- ‘WebHarvy’ and Kimono. Some of the pages on About.com lacked
any structure, Hence, to get a better control over data extraction, we wrote our own
scraper using a java library-Jsoup. We used the dance name and move name as keywords
to extract correct data from YouTube. To extract information about artists and
category of a dance from each individual dance page of dbpedia, we decided to fire
SPQRQL queries using google refine RDF plugin in later stage (after data cleaning
and reconciliation) of our project. This data needed cleaning and unification as same
attributes were represented in different formats in different data sources, information
was clustered in Google refine and mapped to a single unified representation. Also
some of the moves were common in different dances, which were represented as
comma separated values, so we folded these dances for accurate reconciliation.
Google Refine reconciled 88% of our dance names to dbpedia pages. After reconciliation,
we used ‘Add columns by fetching URLs’ feature in Google refine to get the
data of artists and category on each individual Dbpedia page of a dance. We fired
SPARQL queries using ‘Google Refine Expression Language’ (GREL).
2.1.2 SPARQL Queries on Dbpedia to extract information
The information of category of dance and the artists performing a dance is
not directly available on any of the dbpedia pages of a particular dance. The ‘dcterm:
subject’ property of a dance provides categories under which a dance can fall, along
with some other non-dance parameters. In order to extract correct dance related categories,
we used Lucene index based full text search queries and extracted only catego-ries which has ‘*_dance’ in value. To get the artist’s data we performed nested que-ries where, we picked artists by picking only ‘owl: Artist’ data from ‘owl: genre’.
2.3 Record Linkage
Having data from heterogeneous sources was a major challenge for record linkage. We linked dance data from YouTube, about.com, Buzzle.com, Dancesteps.com using FRIL. Record linkage was done based on dance name and category of dance. The thresh-hold for the records to match was kept 80%. Jaro-Winkler measure was used for record linkage. The output was in CSV format. The mapping between dance moves (from Dancesteps.com [1]) and the master-move (from dbpedia [5]) was done using Jaccard word measure. A java program was writ-ten to implement this measure and do the mapping. We finally linked dance-move from one file to another file to link and merge dances and moves and get final output.
2.4 Application Details
The next part was to represent all this collected data in a suitable format from the network analysis perspective. The operations like centrality analysis, nearness, classification, shortest path between two dance forms, were suitable using a graph database. Hence, we selected Neo4j as a backend database, to store this curated data. The entities like artist, dance, move, master-move, beat, tempo, rhythm, origin were represented as nodes of a graph. These nodes were connected using relationships like hasArtist, hasMove, hasMastermove, hasTempo, hasBeat, hasTempo, hasOrigin. The web application involved HTML, CSS, JavaScript as front end technologies, a con-troller was used as a controller to query the backend database-Neo4J.
3. Network Analysis
We analyzed the giant graph of various dances and its different attributes formed as a backend of the application for centrality, between-ness and nearest dance. We will explain these analysis with the help of example. If the user wants to find the common features between two dances, given the input of two dance forms the appli-cation finds the parameters shared by the two dance forms. Fig. 1 shows one such graph.
Figure 1.Centrality between two dances
The other type of analysis offered by the application is ‘finding the nearest dance’, given any dance form. For example, as shown in the following graph, Rockability and 4 step Rocknroll share the maximum number of moves hence, in moves centric analy-sis, these two dances are the most nearest ones. This inference is drawn based on number of paths between two dances considering only the nodes related by relation ‘hasMove’. The similar analysis can be done on the graph, based on relations ‘hasArtist’ and ‘hasCategory’ as well.
Figure 2. Nearest dance
4. Empirical Results
We extracted 387 records from DanceSteps.com [1], 245 records from About.com and youtube.com 126 records from Buzzle.com [3].Deduplication was enabled during record linkage and every record from source1 was inked to at most one record from source2. We got 95% of precision and 91% recall using FRIL [7].To calculate the overall accuracy of the approach used, we cross validated our results by querying YouTube, which we took as a base truth. We queried YouTube with the combination of dance name and every move linked to it, in our database. We consid-
ered the linking to be correct, if YouTube could return at least one video with the exact match of dance name and move name. For example, if YouTube returns at least one video with the query ‘ballroom rumba dance and aida move’, which has ‘ball-room rumba’ and ‘Aida’ in the title or description, we considered rumba dance-Aida move to be a positive match. With this approach, we found precision of 83%. But, for a particular dance, there could be other different moves, which are absent in our data-base. There is no way we can identify these moves, just by querying YouTube with dance name as input. Hence, it was not possible to calculate the correct recall of our approach. A java based program was written to do the mentioned process and calcu-late precision.
5. Conclusion and Future Work
The application described in this paper models the various dance forms and does their network analysis based on the attributes like moves, category, artists, and origin. The application currently includes only these parameters but it can be further expanded to include other attributes like drapery and emotions represented by the dance. The dance ontology developed in the project provides vocabulary in dance domain that is not present today and is very important for the researchers and devel-opers. The proposed ontology is rudimentary and can be extended further. The project currently does not include the chronological evolution of the dances. This feature can be included in the application by applying the NLP techniques to extract the time period information embedded in the text description of Wikipedia. We wish to further expand the scope of the application to include the other dance forms and other per-forming arts as well.
6. References
1. http://www.dancesteps.com.au/moves/index.php
2. http://dance.about.com/od/partnerdancestyles/tp/Ballroom_Dances.htm
3. http://www.buzzle.com/articles/ballroom-dancing/
4. https://www.flickr.com
5. http://dbpedia.org/
6. https://github.com/OpenRefine
7. http://fril.sourceforge.net/
8. http://youtube.com/
