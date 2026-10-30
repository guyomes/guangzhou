python3 scripts/fetch_images.py --list              # see every discovered target + its query
python3 scripts/fetch_images.py --verify-only       # just report which referenced images are missing
python3 scripts/fetch_images.py                     # download all, into scripts/review-downloads/
python3 scripts/fetch_images.py --only canton       # one or a few
python3 scripts/fetch_images.py --candidates 3      # several options per place
python3 scripts/fetch_images.py --sources commons,trip,tripadvisor
