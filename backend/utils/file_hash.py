import hashlib


def compute_md5(file_bytes: bytes) -> str:
    hash_md5 = hashlib.md5()
    hash_md5.update(file_bytes)
    return hash_md5.hexdigest()
